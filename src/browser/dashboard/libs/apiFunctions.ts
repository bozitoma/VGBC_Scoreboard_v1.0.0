import { Scoreboard } from "../../../nodecg/generated/scoreboard";

interface APIResponse {
    // あなたのAPIレスポンスの型定義
    data: {
        tournament: {
            streamQueue: Array<{
                sets: Array<{
                    slots: Array<{
                        entrant: {
                            participants: Array<{
                                gamerTag: string;
                                prefix: string;
                                user: {
                                    authorizations: Array<{
                                        externalUsername: string;
                                    }>;
                                };
                            }>;
                            paginatedSets: {
                                nodes: Array<{
                                    fullRoundText: string;
                                    slots: Array<{
                                        entrant: {
                                            name: string;
                                        };
                                        standing: {
                                            stats: {
                                                score: {
                                                    value: number | null;
                                                };
                                            };
                                        };
                                    }>;
                                }>;
                            };
                        };
                    }>;
                }>;
            }>;
        };
    };
}

const fetchDataFromAPI = async () => {
    try {
        const response = await fetch('https://api.start.gg/gql/alpha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 4ed135b1b2287078b98eca8b79b4eb40' // あなたのトークン
            },
            body: JSON.stringify({
                query: `
                query StreamQueueOnTournament($tourneySlug: String!) {
                    tournament(slug: $tourneySlug) {
                        streamQueue {
                            stream {
                                streamName
                            }
                            sets {
                                slots {
                                    entrant {
                                        id
                                        name
                                        initialSeedNum
                                        participants{
                                          gamerTag
                                          prefix
                                          user{
                                            authorizations(
                                                types : TWITTER
                                              ){
                                                externalUsername
                                              }
                                            bio
                                            birthday
                                            location{
                                              city
                                              country
                                              state
                                            }
                                          }
                                          player{
                                           recentStandings(videogameId: 1386, limit: 5){
                                              standing
                                              entrant{
                                                event{
                                                  numEntrants  
                                                  tournament{
                                                    name
                                                  }
                                                }
                                              }
                                            }
                                             rankings(limit: 3, videogameId:1386 ){
                                                rank
                                                title
                                            }
                                          }
                                        }
                                        paginatedSets(page:1, perPage:30) {
                                            nodes {
                                                id
                                                identifier
                                                phaseGroup {
                                                    phase {
                                                        name
                                                    }
                                                }
                                                fullRoundText
                                                slots {
                                                    entrant{
                                                      name
                                                    }
                                                      
                                                    standing {
                                                        stats {
                                                            score {
                                                                value
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                      }
                  }
                `,
                variables: {
                    'tourneySlug': "api-test-1"
                }
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`API request failed with status ${response.status}: ${data.message}`);
            return null;
        }

        return data;

    } catch (error) {
        console.error("APIの呼び出し中にエラーが発生しました:", error);
        return null;
    }
}

export { fetchDataFromAPI };

interface TransformError {
    error: true;
    message: string;
}

type TransformResult = Scoreboard | TransformError;

export const transformApiResponseToScoreboard = (response: APIResponse): TransformResult => {
    const firstSet = response.data?.tournament?.streamQueue?.[0]?.sets?.[0];

    if (!firstSet) {
        return {
            error: true,
            message: "streamQueueが設定されていません"
        };
    }

    const fullRoundText = firstSet.slots[0]?.entrant?.paginatedSets?.nodes[0]?.fullRoundText || "";
    const player1Data = firstSet?.slots[0]?.entrant?.participants[0];
    const player2Data = firstSet?.slots[1]?.entrant?.participants[0];

    const player1 = {
        name: player1Data?.gamerTag || "Player1",
        prefix: player1Data?.prefix || "",
        xID: "",
        score: 0
    };

    const player2 = {
        name: player2Data?.gamerTag || "Player2",
        prefix: player2Data?.prefix || "",
        xID: "",
        score: 0
    };

    return {
        player1,
        player2,
        fullRoundText: fullRoundText
    };
};