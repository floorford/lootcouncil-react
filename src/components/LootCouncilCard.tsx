import { Item, MappedAttendance, Member, Raid } from "../types";
import LootTable from "./LootTable";
import Stats from "./Stats";
import MemberCard from "./Member";
import { useState } from "react";
import Checkbox from "./Checkbox";

type LCCProps = {
  member: Member;
  memberLoot: Item[];
  raids: Raid[];
  memberAttendance: MappedAttendance[];
  deletePlayer: () => void;
};

const LootCouncilCard = ({
  member,
  raids,
  memberLoot,
  memberAttendance,
  deletePlayer,
}: LCCProps) => {
  const [isMainSpec, toggleIsMainSpec] = useState(true);
  const [isOffSpec, toggleIsOffSpec] = useState(true);

  const specFilteredLoot = memberLoot.filter((loot) => {
    if (isMainSpec && isOffSpec)
      return loot.spec === "MS" || loot.spec === "OS" || loot.spec === "ROLL";
    if (isMainSpec) return loot.spec === "MS";
    if (isOffSpec) return loot.spec === "OS" || loot.spec === "ROLL";
    return true;
  });
  return (
    <section className={`lc ${member.class}`}>
      <div className="float-right">
        <i className="fas fa-lg fa-times" onClick={deletePlayer}></i>
      </div>
      <MemberCard member={member} interactive={true} propClass="" />

      <div className="collapsible">
        <Stats
          member={member}
          raids={raids}
          totalLoot={memberLoot}
          attendance={memberAttendance}
        />

        <section className="player-info">
          <Checkbox
            label="MS"
            handleToggle={() => toggleIsMainSpec(!isMainSpec)}
            isChecked={isMainSpec}
          />
          <Checkbox
            label="OS/ROLL"
            handleToggle={() => toggleIsOffSpec(!isOffSpec)}
            isChecked={isOffSpec}
          />
        </section>

        <LootTable
          items={specFilteredLoot}
          maxHeight={350}
          playerClass={member.class}
          raids={raids}
        />
      </div>
    </section>
  );
};

export default LootCouncilCard;
