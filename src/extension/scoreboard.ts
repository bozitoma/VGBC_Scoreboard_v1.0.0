import {NodeCG} from "./nodecg";
import { Scoreboard } from "../nodecg/generated/scoreboard";

export const scoreboard = (nodecg: NodeCG) => {
	// 今後の実装でなんかあったらログ出すようにする
	// const log = new nodecg.Logger("scoreboard");
	const defaultValue: Scoreboard = {
		player1: {
            name: 'Player1',
            prefix: 'Team',
            Xid: '@',
            score: 0
        },
        player2: {
            name: 'Player2',
            prefix: 'Team',
            Xid: '@',
            score: 0
        },
        fullRoundText: ''
	}
	const scoreboardRep = nodecg.Replicant("scoreboard")
	scoreboardRep.value = defaultValue

	const updateScoreboard = (data: Scoreboard) => {
		scoreboardRep.value = data
	}

	nodecg.listenFor("scoreboard:update",updateScoreboard)
};



