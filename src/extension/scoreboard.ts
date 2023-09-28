import {NodeCG} from "./nodecg";
import { Scoreboard } from "../nodecg/generated/scoreboard";

export const scoreboard = (nodecg: NodeCG) => {
	// 今後の実装でなんかあったらログ出すようにする
	// const log = new nodecg.Logger("scoreboard");
	const defaultValue: Scoreboard = {
		player1_name: "a",
		player1_prefix: "a",
		player1_score: 0,
		player2_name: "",
		player2_prefix: "",
		player2_score: 0,
		fullRoundText: ""
	}
	const scoreboardRep = nodecg.Replicant("scoreboard")
	scoreboardRep.value = defaultValue

	const updateScoreboard = (data: Scoreboard) => {
		scoreboardRep.value = data
	}

	nodecg.listenFor("scoreboard:update",updateScoreboard)
};



