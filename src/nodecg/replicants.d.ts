import { Scoreboard } from "./generated/scoreboard";
import { Iku } from "./generated/iku";
import { Playerdata, Player, SetDetails, Standing  } from "./generated/playerdata";
import { Bracket, Bracketscore } from "./generated/bracket";
import { Info } from "./generated/info";
import { Mc } from "./generated/mc";

type ReplicantMap = {
	scoreboard: Scoreboard;
	iku: Iku;
	playerdata:Playerdata;
	player:Player;
	setDetails:SetDetails;
	standing:Standing;
	bracket:Bracket;
	bracketscore:Bracketscore;
	info:Info;
	mc:Mc;

};

export type {
	ReplicantMap,
	Scoreboard,
	Iku,
	Playerdata,
	Player,
	SetDetails,
	Standing,
	Bracket,
	Bracketscore,
	Info,
	Mc
};
