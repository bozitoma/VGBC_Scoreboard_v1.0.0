/* eslint-disable @typescript-eslint/no-explicit-any */
import { Playerdata, Player, SetDetails, Standing } from "../../../nodecg/generated/playerdata";

  const playerDataQuery = `
  query SetEntrants($setId: ID!) {
    set(id: $setId) {
      id
      slots {
        id
        entrant {
          id
          name
          initialSeedNum
          participants {
            gamerTag
            prefix
            user {
              authorizations(types: TWITTER) {
                externalUsername
              }
              bio
              birthday
              location {
                city
                country
                state
              }
            }
            player {
              recentStandings(videogameId: 1386, limit: 10) {
                standing
                entrant {
                  event {
                    numEntrants
                    tournament {
                      name
                    }
                  }
                }
              }
              rankings(limit: 3, videogameId: 1386) {
                rank
                title
              }
            }
          }
          paginatedSets(page: 1, perPage: 30, sortType: ROUND) {
            nodes {
              id
              identifier
              phaseGroup {
                phase {
                  name
                }
              }
              fullRoundText
              lPlacement
              wPlacement
              slots {
                entrant {
                  participants {
                    prefix
                    gamerTag
                  }
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
  }`

  

  export const getPlayerData = async (setId?: Number): Promise<Playerdata> => {
    if (!setId) {
      return {
        playerData: {
          player1: defaultPlayerData(),
          player2: defaultPlayerData()
        }
      };
    }

    const variables = {
      setId: setId,
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
        query: playerDataQuery,
        variables,
      }),
    }).then((res) => res.json());

    console.log("API Response:", res);

    if (res.errors) {
      console.error(res.errors)
      return {
        playerData: {
          player1: defaultPlayerData(),
          player2: defaultPlayerData()
        }
      };
    }

    // Extract player data for both players
    const slots = res.data.set.slots;
    const player1Data = extractPlayerData(slots[0]) || defaultPlayerData();
    const player2Data = extractPlayerData(slots[1]) || defaultPlayerData();

    return {
      playerData: {
        player1: player1Data,
        player2: player2Data
      }
    };
}

const extractPlayerData = (slot: any): Player | null => {
  if (!slot || !slot.entrant) {
    return null;
  }

  const entrant = slot.entrant;
  const participant = entrant.participants[0];
  const user = participant.user;
  const player = participant.player;

  const paginatedSetsDetails: SetDetails[] = entrant.paginatedSets && entrant.paginatedSets.nodes 
    ? entrant.paginatedSets.nodes.map((node: any) => ({
        identifier: node.identifier,
        phasename: node.phaseGroup?.phase?.name || "", 
        Round: node.fullRoundText || "",
        player1name: node.slots[0]?.entrant?.participants[0]?.gamerTag || null,
        player1score: node.slots[0]?.standing?.stats?.score?.value ?? 0,
        player2name: node.slots[1]?.entrant?.participants[0]?.gamerTag || null,
        player2score: node.slots[1]?.standing?.stats?.score?.value ?? 0
      }))
    : [];

  const recentStandings: Standing[] = player.recentStandings 
      ? player.recentStandings.map((standing: any) => ({
          tournamentName: standing.entrant.event.tournament.name,
          standing: standing.standing,
          numEntrants: standing.entrant.event.numEntrants
        }))
      : [];

      const { winRate } = extractPaginatedSetsData(entrant.paginatedSets, participant.gamerTag);


  return {
    id: entrant.id,
    name: entrant.name,
    score: 0,
    initialSeedNum: entrant.initialSeedNum,
    gamerTag: participant.gamerTag,
    prefix: participant.prefix,
    externalUsername: user?.authorizations[0]?.externalUsername || null,
    bio: user?.bio,
    birthday: user?.birthday,
    city: user?.location.city,
    country: user?.location.country,
    winRate: winRate,
    paginatedSetsDetails: paginatedSetsDetails,
    recentStandings: recentStandings,
    rankings: player.rankings
  };
}

const extractPaginatedSetsData = (entrantSets: any, entrantName: string) => {
  let totalScores = 0;
  let ownTotalScores = 0;

  const nodes: any[] = entrantSets.nodes ?? [];

  console.log("Nodes:", nodes);  // nodesの内容をログ出力

  nodes.forEach((node: any) => {
    const slots: any[] = node.slots ?? [];
    console.log("Slots:", slots);  // slotsの内容をログ出力

    const ownSlot = slots.find((slot: any) => slot && slot.entrant && slot.entrant.participants[0].gamerTag === entrantName);
    const opponentSlot = slots.find((slot: any) => slot !== ownSlot);

    console.log("OwnSlot:", ownSlot);  // ownSlotの内容をログ出力

    const ownScoreValue = ownSlot?.standing?.stats?.score?.value ?? 0;
    const opponentScoreValue = opponentSlot?.standing?.stats?.score?.value ?? 0;

    totalScores += ownScoreValue + opponentScoreValue;
    ownTotalScores += ownScoreValue;
  });

  console.log("Total Scores:", totalScores);  // ログ出力
  console.log("Own Total Scores:", ownTotalScores);  // ログ出力

  const winRate = totalScores === 0 ? 0 : (ownTotalScores / totalScores) * 100;

  return { winRate };
};








const defaultPlayerData = (): Player => ({
  id: 0,
  name: '',
  score: 0,
  initialSeedNum: 0,
  gamerTag: '',
  prefix: null,
  externalUsername: null,
  bio: null,
  birthday: null,
  city: null,
  country: null,
  winRate: 1,
  paginatedSetsDetails: [],
  recentStandings: [],
  rankings: []
});








// ...







//過去setsと選手データを一括取得するクエリ
// query SetEntrants($setId: ID!, $perPage: Int) {
//   set(id: $setId) {
//     id
//     slots {
//       id
//       entrant {
//         id
//         name
//         initialSeedNum
//         participants {
//           gamerTag
//           prefix
//           user {
//             authorizations(types: TWITTER) {
//               externalUsername
//             }
//             bio
//             birthday
//             location {
//               city
//               country
//               state
//             }
//           }
//           player {
//             recentStandings(videogameId: 1386, limit: 10) {
//               standing
//               entrant {
//                 event {
//                   numEntrants
//                   tournament {
//                     name
//                   }
//                 }
//               }
//             }
//             sets(perPage: $perPage, page: 1) {
//               nodes {
//                 createdAt
//                 event {
//                   tournament {
//                     name
//                   }
//                 }
//                 slots {
//                   entrant {
//                     participants {
//                       prefix
//                       gamerTag
//                       player{
//                         id
//                       }
//                     }
//                   }
//                   standing {
//                     stats {
//                       score {
//                         value
//                       }
//                     }
//                   }
//                 }
//               }
//             }
//             rankings(limit: 3, videogameId: 1386) {
//               rank
//               title
//             }
//           }
//         }
//         paginatedSets(page: 1, perPage: 30) {
//           nodes {
//             id
//             identifier
//             phaseGroup {
//               phase {
//                 name
//               }
//             }
//             fullRoundText
//             lPlacement
//             wPlacement
//             slots {
//               entrant {
//                 participants {
//                   prefix
//                   gamerTag
//                 }
//               }
//               standing {
//                 stats {
//                   score {
//                     value
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   }
// }