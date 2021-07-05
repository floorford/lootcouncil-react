import { LootTableProps, Detail } from "../types";
import { Link } from "react-router-dom";

const LootTable = ({
    details,
    playerClass,
    maxHeight
}: LootTableProps): JSX.Element => {
    return (
        <section className={`player-info ${playerClass}`}>
            <h3 className="pink">Loot Recieved</h3>
            {details ? (
                <div className="table-wrapper" style={{ maxHeight: maxHeight }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Raid</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {details.map((item: Detail) => {
                                let formattedItems: any = item.item.split("/");
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <Link to={`/raids/${item.id}`}>
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td>
                                            {formattedItems.map(
                                                (x: string, i: number) => (
                                                    <p key={i}>{x}</p>
                                                )
                                            )}
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
};

export default LootTable;
