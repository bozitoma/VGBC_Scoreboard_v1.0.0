/* eslint-disable @typescript-eslint/no-explicit-any */

export type Match = {
  id: number
  roundText: string
  streamName: string
  p1?: PlayerScore
  p2?: PlayerScore
  state: string
}
export type StreamQueue = Match[]

export type PlayerScore = {
    team: string
    playerName: string
    score: number
    xID: string
  }

const fullRoundText2Shorts: { [key: string]: string } = {
  "Grand Final Reset": "Grand Finals",
  "Grand Final": "Grand Finals",
  "Winners Final": "Winners Finals",
  "Winners Semi-Final": "Winners Semis",
  "Winners Quarter-Final": "Winners Quarters",
  "Losers Final": "Losers Finals",
  "Losers Semi-Final": "Losers Semis",
  "Losers Quarter-Final": "Losers Quarters",
}

const streamQueueQuery = `
query StreamQueueOnTournament($tourneySlug: String!, $eventSlug: String!) {
  tournament(slug: $tourneySlug) {
    id
    startAt
    streamQueue {
      stream {
        streamSource
        streamName
      }
      sets {
        id
        fullRoundText
        state
        lPlacement
        wPlacement
        slots {
          entrant {
            name
            participants {
                gamerTag
                prefix
                user {
                    authorizations (types: [TWITTER]) {
                    externalUsername
                }
              }
            }
          }
        }
      }
    }
  }
  event(slug: $eventSlug) {
    sets(perPage: 50, filters: {state: [1, 2], hideEmpty: true}) {
      pageInfo {
        totalPages
        total
      }
      nodes {
        id
        fullRoundText
        lPlacement
        wPlacement
        state
        slots {
          entrant {
            name
            participants {
                gamerTag
                prefix
                user {
                    authorizations (types: [TWITTER]) {
                    externalUsername
                }
              }
            }
          }
        }
      }
    }
  }
}`

const nextQuery = `
query StreamQueueOnTournament($eventSlug: String!, $page: Int!) {
  event(slug: $eventSlug) {
    sets(perPage: 50, page: $page, filters: {state: [1, 2], hideEmpty: true}) {
      pageInfo {
        totalPages
        total
      }
      nodes {
        id
        fullRoundText
        lPlacement
        wPlacement
        state
        slots {
          entrant {
            name
            participants {
                gamerTag
                prefix
                user {
                    authorizations (types: [TWITTER]) {
                    externalUsername
                }
              }
            }
          }
        }
      }
    }
  }
}`

const getEventSlug = (url: string): string => {
    if (!url.startsWith("https://www.start.gg/tournament/")) {
      return ""
    }
    const urlParts = url.split("/")
    if (urlParts.length < 7) {
      return ""
    }
    return `${urlParts[3]}/${urlParts[4]}/${urlParts[5]}/${urlParts[6]}`
  }

const getTournarySlug = (url: string): string => {
  if (!url.startsWith("https://www.start.gg/tournament/")) {
    return ""
  }
  const urlParts = url.split("/")
  return `${urlParts[3]}/${urlParts[4]}`
}

const getRoundText = (set: any): string => {
    const lookupResult = fullRoundText2Shorts[set?.fullRoundText || ""];
    
    if (lookupResult) {
      return lookupResult;
    }
  
    const fullRoundText = set?.fullRoundText;
    if (!fullRoundText) {
      return "";
    }
  
    if (set?.lPlacement) {
      if (fullRoundText.startsWith("Winners")) {
        return `Winners Top${(set.lPlacement - 1) * 2}`;
      } else if (fullRoundText.startsWith("Losers")) {
        return `Losers Top${(set.wPlacement - 1) * 2}`;
      }
    }
  
    return fullRoundText;
  }

export const getStreamQueue = async (url?: string): Promise<StreamQueue> => {
  if (!url) {
    return []
  }
  const tournarySlug = getTournarySlug(url)
  const eventSlug = getEventSlug(url)
  if (tournarySlug === "" || eventSlug === "") {
    return []
  }
  const variables = {
    tourneySlug: tournarySlug,
    eventSlug: eventSlug,
  }
  const res = await fetch(`https://api.smash.gg/gql/alpha`, {
    method: "POST",
    headers: {
      Authorization: "Bearer b02471b232fafc5d8a67c6e1fe9afd69",
      "Content-Type": "application/json",
      Accept: "application/json",
      encoding: "utf-8",
    },
    body: JSON.stringify({
      query: streamQueueQuery,
      variables,
    }),
  }).then((res) => res.json())

  if (res.errors) {
    console.error(res.errors)
    return []
  }
  const streamQueue =
    res?.data?.tournament?.streamQueue?.flatMap((stream: any) => {
      return stream.sets.map((set: any) => {
        const players = set.slots.map((slot: any) => {
            if (!slot?.entrant) {
                return {
                    team: "",
                    playerName: "",
                    xID: "",
                    score: 0,
                }
            }
            
            // 変更箇所: 直接 participants から gamerTag と prefix を取得
            const team = slot?.entrant?.participants?.[0]?.prefix || "";
            const name = slot?.entrant?.participants?.[0]?.gamerTag || "";

            return {
                team,
                playerName: name,
                twitterID:
                    slot?.entrant?.participants[0]?.user?.authorizations[0]
                        ?.externalUsername || "",
                score: 0,
            }
        });
        return {
          id: set.id,
          roundText: getRoundText(set),
          streamName: stream?.stream?.streamName,
          p1: players[0],
          p2: players[1],
          state: set?.state === 2 ? "In Progress" : "In Queue",
        }
      })
    }) || []

    streamQueue.push(
        ...(res?.data?.event?.sets?.nodes?.map((set: any) => {
              const players = set.slots.map((slot: any) => {
                if (!slot?.entrant || !slot.entrant.participants || slot.entrant.participants.length === 0) {
                    return {
                        team: "",
                        playerName: "",
                        xID: "",
                        score: 0,
                    }
                }
                
                const team = slot.entrant.participants[0]?.prefix || "";
                const name = slot.entrant.participants[0]?.gamerTag || "";
                const twitterID = (slot.entrant.participants[0]?.user?.authorizations && slot.entrant.participants[0]?.user?.authorizations.length > 0) ?
                    slot.entrant.participants[0]?.user?.authorizations[0]?.externalUsername : "";
                
                return {
                    team,
                    playerName: name,
                    twitterID: twitterID,
                    score: 0,
                }
            });
            return {
                id: set.id,
                roundText: getRoundText(set),
                streamName: "",
                p1: players[0],
                p2: players[1],
                state: set?.state === 2 ? "In Progress" : "Waiting",
            }
        }) || [])
    )
    

    const totalPages = res?.data?.event?.sets?.pageInfo?.totalPages;
    if (totalPages && totalPages > 1) {
        for (let i = 2; i <= totalPages; i++) {
            const variables = {
                eventSlug: eventSlug,
                page: i,
            };
            const res = await fetch(`https://api.smash.gg/gql/alpha`, {
                method: "POST",
                headers: {
                    Authorization: "Bearer b02471b232fafc5d8a67c6e1fe9afd69",
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    encoding: "utf-8",
                },
                body: JSON.stringify({
                    query: nextQuery,
                    variables,
                }),
            }).then((res) => res.json());
    
            if (res.errors) {
                continue;
            }
    
            streamQueue.push(
                ...(res?.data?.event?.sets?.nodes?.map((set: any) => {
                    const players = set.slots.map((slot: any) => {
                        if (!slot?.entrant) {
                            return {
                                team: "",
                                playerName: "",
                                xID: "",
                                score: 0,
                            };
                        }
                        
                        // 変更箇所: 直接 participants から gamerTag と prefix を取得
                        const team = slot?.entrant?.participants[0]?.prefix || "";
                        const name = slot?.entrant?.participants[0]?.gamerTag || "";
    
                        return {
                            team,
                            playerName: name,
                            xID:
                                slot?.entrant?.participants[0]?.user?.authorizations[0]
                                    ?.externalUsername || "",
                            score: 0,
                        };
                    });
                    return {
                        id: set.id,
                        roundText: getRoundText(set),
                        streamName: "",
                        p1: players[0],
                        p2: players[1],
                        state: set?.state === 2 ? "In Progress" : "Waiting",
                    };
                }) || [])
            );
        }
    }
  const idMap = new Map()

  return streamQueue.filter((queue: any) => {
    const id = queue.id
    if (idMap.has(id)) {
      return false
    }
    idMap.set(id, true)
    return true
  })
}