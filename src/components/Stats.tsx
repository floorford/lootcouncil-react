import { StatsProps } from "../types";

const Stats = ({ member, raids, totalLoot, attendance }: StatsProps) => {
  const { absence, six_months, count_from } = member;

  const { no_show, late, passed_spot } = attendance.reduce(
    (acc, val) => {
      if (val.event === "No Show") acc.no_show += 1;
      if (val.event === "Late") acc.late += 1;
      if (val.event === "Passed Spot") acc.passed_spot += 1;

      return acc;
    },
    { no_show: 0, late: 0, passed_spot: 0 }
  );

  const firstRaid = raids.find(
    (raid) => new Date(raid.date) >= new Date(count_from)
  );

  const totalRaids = raids.filter(
    (raid) => new Date(raid.date) >= new Date(count_from)
  ).length;

  const lootNumber = totalLoot.length;
  const calcAttendance = Math.ceil(
    ((Number(totalRaids) - Number(absence)) / totalRaids) * 100
  );

  return (
    <section className={`player-info ${member.class}`}>
      <h3 className="pink">Player Stats</h3>
      <section className="flex" style={{ justifyContent: "space-between" }}>
        <div>
          {firstRaid && (
            <p>
              <strong>First raid:</strong> {firstRaid.title}: {firstRaid.date}
            </p>
          )}
          <p>
            <strong>Missed Raids:</strong> {absence}
          </p>
          <p>
            <strong>Total loot:</strong> {lootNumber}
          </p>
        </div>
        <div>
          <p>
            <strong>Attendance:</strong>{" "}
            {!isNaN(calcAttendance) ? calcAttendance : 0}%
          </p>

          {no_show ? (
            <p>
              <strong>No shows:</strong> {no_show}
            </p>
          ) : null}

          {late ? (
            <p>
              <strong>Late:</strong> {late}
            </p>
          ) : null}

          {passed_spot ? (
            <p>
              <strong>Passed Spot:</strong> {passed_spot}
            </p>
          ) : null}

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
