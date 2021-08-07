import { useHistory } from "react-router-dom";
import lcStore from "../store/lc";
import { MemberProps } from "../types";
import { toTitleCase, ucFirst } from "../helper";
import "../css/members.css";
import logsIcon from "../assets/warcraftlogs.png";

const Member = ({
  member,
  interactive = true,
  propClass = "",
}: MemberProps): JSX.Element => {
  const history = useHistory();

  const selectMember = () => {
    if (interactive) {
      lcStore.setMember(member);
      history.push(`/members/id/${member.id}`);
    }
  };

  const urlName =
    member.member.indexOf("/") !== -1
      ? member.member.slice(0, member.member.indexOf("/"))
      : member.member;

  return (
    <section className={`member ${member.class} ${propClass}`}>
      <img
        className="class-icon"
        alt={member.class}
        src={`/lootcouncil-react/assets/${member.class.replace(/\s/g, "")}.png`}
      />
      <div className="member-wrapper">
        <header className="member-header">
          <h1 onClick={selectMember}>{member.member}</h1>
        </header>
        <p>{toTitleCase(member.class)}</p>
        <p>Rank: {ucFirst(member.rank)}</p>
        <a
          href={`https://classic.warcraftlogs.com/character/eu/firemaw/${urlName}`}
          target="_blank"
          className="tooltip"
          rel="noreferrer"
        >
          <img className="icon" alt="Warcraft Logs" src={logsIcon} />
          <span className="tooltip-text">Warcraft Logs</span>
        </a>
      </div>
    </section>
  );
};

export default Member;
