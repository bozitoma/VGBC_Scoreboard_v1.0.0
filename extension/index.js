'use strict';

const scoreboard = (nodecg) => {
  const defaultValue = {
    player1: {
      name: "Player1",
      prefix: "Team",
      Xid: "@",
      score: 0
    },
    player2: {
      name: "Player2",
      prefix: "Team",
      Xid: "@",
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
};

var index = (nodecg) => {
  scoreboard(nodecg);
};

module.exports = index;
//# sourceMappingURL=index.js.map
