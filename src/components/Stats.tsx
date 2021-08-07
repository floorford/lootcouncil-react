import { StatsProps } from "../types";

const Stats = ({ member, raidTotal, totalLoot, attendance }: StatsProps) => {
  const { absence, prev_raids, six_months } = member;

  const { no_show, late, passed_spot } = attendance.reduce(
    (acc, val) => {
      if (val.event === "No Show") acc.no_show += 1;
      if (val.event === "Late") acc.late += 1;
      if (val.event === "Passed Spot") acc.passed_spot += 1;

      return acc;
    },
    { no_show: 0, late: 0, passed_spot: 0 }
  );
  const lootNumber = totalLoot.length;
  const calcAttendance = Math.ceil((Number(+prev_raids) / raidTotal) * 100);
  return (
    <section className={`player-info ${member.class}`}>
      <h3 className="pink">Player Stats</h3>
      <section className="flex" style={{ justifyContent: "space-between" }}>
        <div>
          <p>
            <strong>Missed Raids:</strong> {absence}
          </p>
          <p>
            <strong>Total loot recieved:</strong> {lootNumber}
          </p>
        </div>
        <div>
          <p>
            <strong>Attendance:</strong>{" "}
            {!isNaN(calcAttendance) ? calcAttendance : 0}%
          </p>
          <p>
            <strong>No shows:</strong> {no_show}
          </p>
          <p>
            <strong>Late:</strong> {late}
          </p>
          <p>
            <strong>Passed Spot:</strong> {passed_spot}
          </p>
          {six_months === "1" ? (
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
