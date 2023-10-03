'use strict';

const scoreboard = (nodecg) => {
  const defaultValue = {
    player1: {
      name: "Player1",
      prefix: "Team",
      xID: "@",
      score: 0
    },
    player2: {
      name: "Player2",
      prefix: "Team",
      xID: "@",
      score: 0
    },
    fullRoundText: ""
  };
  const scoreboardRep = nodecg.Replicant("scoreboard");
  scoreboardRep.value = defaultValue;
  const updateScoreboard = (data) => {
    scoreboardRep.value = data;
  };
  nodecg.listenFor("scoreboard:update", updateScoreboard);
  const bracketRep = nodecg.Replicant("bracket");
  bracketRep.value = {
    bracketData: [{
      identifier: "",
      fullRoundText: "",
      player1: {
        prefix: "",
        name: "",
        score: 0
      },
      player2: {
        prefix: "",
        name: "",
        score: 0
      }
    }]
  };
  console.log(bracketRep.value);
  const infoRep = nodecg.Replicant("info");
  infoRep.value = {
    title: "",
    text: ""
  };
  const mcRep = nodecg.Replicant("mc");
  mcRep.value = {
    McLeft: {
      name: "",
      xID: ""
    },
    McRight: {
      name: "",
      xID: ""
    }
  };
};

var index = (nodecg) => {
  scoreboard(nodecg);
};

module.exports = index;
//# sourceMappingURL=index.js.map
