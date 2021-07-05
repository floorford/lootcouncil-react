import { StatsProps, Detail } from "../types";

const Stats = ({ member, raidTotal, totalLoot, attendance }: StatsProps) => {
  const { absence, prev_raids, six_months } = member;
  const { no_show, late, passed_spot } = attendance;

  const lootNumber = totalLoot
    .slice()
    .reduce((acc: number, val: Detail): number => {
      const itemSplit = val.item.split("/");
      acc += itemSplit.length;
      return acc;
    }, 0);

  return (
    <section className={`player-info ${member.class}`}>
      <h3 className="pink">Player Stats</h3>
      <section className="flex" style={{ justifyContent: "space-between" }}>
        <div>
          <p>Missed Raids: {absence}</p>
          <p>Total loot recieved: {lootNumber}</p>
        </div>
        <div>
          <p>
            Attendance:{" "}
            {Math.ceil(((raidTotal - Number(prev_raids)) / raidTotal) * 100)}%
          </p>
          <p>No shows: {no_show}</p>
          <p>Late: {late}</p>
          <p>Passed Spot: {passed_spot}</p>
          {six_months ? (
            <p>
              6 months<sup>+</sup> member
            </p>
          ) : null}
        </div>
      </section>
    </section>
  );
};

export default Stats;
