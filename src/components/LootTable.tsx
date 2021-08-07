import { LootTableProps } from "../types";
import { Link } from "react-router-dom";

const LootTable = ({
  items,
  playerClass,
  maxHeight,
  raids,
}: LootTableProps): JSX.Element => (
  <section className={`player-info ${playerClass}`}>
    <h3 className="pink">Loot Recieved</h3>
    {items.length ? (
      <div className="table-wrapper" style={{ maxHeight: maxHeight }}>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Raid</th>
              <th>Item</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const raid = raids.find((raid) => raid.id === item.raid_id);
              return (
                <tr key={item.id}>
                  {raid && (
                    <>
                      <td>{raid.date}</td>
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
                      {item.title} - {item.spec}
                    </a>
                  </td>
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

export default LootTable;
