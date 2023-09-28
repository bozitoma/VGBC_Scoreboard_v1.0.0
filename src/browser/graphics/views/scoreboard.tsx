import "modern-normalize";
import "../styles/adobe-fonts.js";
import {render} from "../../render.js";
import { useReplicant } from "../../use-replicant.js";
import {Scoreboard} from "../components/scoreboard/Scoreboard.js"

const App = () => {
	const scoreboardRep = useReplicant("scoreboard")
	console.log(scoreboardRep);
	return (
		<>
			<Scoreboard/>
		</>
	);
};


render(<App />);
