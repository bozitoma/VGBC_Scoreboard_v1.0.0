import "./Scoreboard.css";
import { useReplicant } from "../../../use-replicant.js";

export const Scoreboard = (): JSX.Element => {
  const scoreboardRep = useReplicant("scoreboard")

  return (
    <div className="scoreboard">
      <div className="p-scoreboard">
        <div className="name-score-bg">
          <div className="name-group">
            <div className="names">
              <div className="text-wrapper">{scoreboardRep?.player1_prefix}</div>
              <div className="text-wrapper">{scoreboardRep?.player1_name}</div>
            </div>
          </div>
          <div className="score-group">
            <div className="overlap-group">
              <div className="score">{scoreboardRep?.player1_score}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="div">
        <div className="p-name-group">
          <div className="p-score">
            <div className="score-wrapper">
              <div className="score">{scoreboardRep?.player2_score}</div>
            </div>
          </div>
        </div>
        <div className="name">
          <div className="p-names">
            <div className="text-wrapper">{scoreboardRep?.player2_prefix}</div>
            <div className="text-wrapper">{scoreboardRep?.player2_name}</div>
          </div>
        </div>
      </div>
      <div className="info-scoreboard">
        <div className="overlap">
          <div className="info-bg" />
          <div className="info-text">{scoreboardRep?.fullRoundText}</div>
        </div>
      </div>
    </div>
  );
};
