import { LootTableProps, Member } from "../types";
import { Link, useHistory } from "react-router-dom";
import lcStore from "../store/lc";

const LootTable = ({
  items,
  playerClass,
  maxHeight,
  raids,
  forOverview,
  members,
}: LootTableProps): JSX.Element => {
  const history = useHistory();

  const selectMember = (member: Member) => {
    lcStore.setMember(member);
    history.push(`/members/id/${member.id}`);
  };

  return (
    <section className={`player-info ${playerClass}`}>
      <h3 className="pink">Loot Recieved</h3>
      {items.length ? (
        <div className="table-wrapper" style={{ maxHeight: maxHeight }}>
          <table>
            <thead>
              <tr>
                {!forOverview && (
                  <>
                    <th>Date</th>
                    <th>Raid</th>
                  </>
                )}
                <th>Item</th>
                {members ? <th>Member</th> : null}
                <th>Spec</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const raid = raids.find((raid) => raid.id === item.raid_id);
                const relevantMember = members
                  ? members.find((member) => member.id === item.member_id)
                  : null;
                return (
                  <tr key={item.id}>
                    {raid && !forOverview && (
                      <>
                        <td>{new Date(raid.date).toLocaleDateString()}</td>
                        <td>
                          <Link to={`/raids/${raid.id}`}>{raid.title}</Link>
                        </td>
                      </>
                    )}
                    <td>
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={`https://tbc.wowhead.com/item=${item.item_id}`}
                      >
                        {item.title}
                      </a>
                    </td>
                    {relevantMember && (
                      <td
                        className="asLink"
                        style={{ cursor: "pointer" }}
                        onClick={() => selectMember(relevantMember)}
                      >
                        {relevantMember.member}
                      </td>
                    )}
                    <td>{item.spec}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No loot recieved!</p>
      )}
    </section>
  );
};

export default LootTable;
