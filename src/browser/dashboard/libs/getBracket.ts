import { Bracketscore, Bracket } from "../../../nodecg/generated/bracket";

const BracektQuery = `
query PhaseGroupSets($phaseGroupId: ID!){
    phaseGroup(id:$phaseGroupId){
      phase {
        name
      }
      sets(
        page: 1
        perPage: 16
        sortType: ROUND
      ){
        nodes{
          id
          identifier
          fullRoundText
          slots{
            entrant{
              id
              name
              participants {
                player {
                  id
                  prefix
                  gamerTag
                }
              }
            }
            standing {
              placement
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
  }`

  export const getPhaseGroupId = (url: string): string => {
    if (!url.startsWith("https://www.start.gg/tournament/")) {
      return "";
    }
    const urlParts = url.split("/");
    return urlParts[9] || "";
}

export const formatBracketResponse = (response: any): Bracket => {
    const bracketData = (response.data.phaseGroup.sets.nodes || []).map((node: any) => {
      const player1Data = node.slots[0] || {};
      const player2Data = node.slots[1] || {};
  
      const player1: Bracketscore = {
        prefix: player1Data.entrant?.participants[0]?.player?.prefix || "",
        name: player1Data.entrant?.participants[0]?.player?.gamerTag || "",
        score: player1Data.standing?.stats?.score?.value || 0
      };
  
      const player2: Bracketscore = {
        prefix: player2Data.entrant?.participants[0]?.player?.prefix || "",
        name: player2Data.entrant?.participants[0]?.player?.gamerTag || "",
        score: player2Data.standing?.stats?.score?.value || 0
      };
  
      return {
        identifier: node.identifier,
        fullRoundText: node.fullRoundText,
        player1,
        player2
      };
    });
  
    return {
      bracketData
    };
  };
  
  // 使用例
  export const getBracket = async (url?: string): Promise<Bracket> => {
    if (!url) {
      return { bracketData: [] };
    }
    const phaseGroupId = getPhaseGroupId(url);
    if (phaseGroupId === "") {
      return { bracketData: [] };
    }
    const variables = {
      phaseGroupId: phaseGroupId,
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
        query: BracektQuery,
        variables,
      }),
    }).then((res) => res.json());
  
    if (res.errors) {
      console.error(res.errors);
      return { bracketData: [] };
    }
  
    return formatBracketResponse(res);
  };
  