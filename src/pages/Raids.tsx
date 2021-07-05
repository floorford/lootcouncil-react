import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { RoleRankClass, Loot } from "../types";
import lcStore from "../store/lc";
import axios from "../axios";

const Raids = () => {
  const [{ raids }, setRaidsData] = useState(lcStore.initialState);

  const location = useLocation();
  const [selectedFilter, setFilter] = useState<string>(
    location.pathname.replace(/[^0-9]+/, "")
  );
  const [raidDetails, setRaidDetails] = useState([]);

  const raidID = selectedFilter;

  useEffect(() => {
    lcStore.init();
    const sub = lcStore.subscribe(setRaidsData);

    if (!raids.length) {
      axios
        .get("")
        .then((response) => {
          lcStore.setRaids(response.data);
          lcStore.setLoading(false);
        })
        .catch((ex) => {
          const err =
            ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";
          lcStore.setError(err);
          lcStore.setLoading(false);
        });
    }

    if (raidID) {
      axios
        .get(`/tabs/raids/id/${raidID}`)
        .then((response) => {
          axios
            .get(`/tabs/items/raid_id/${raidID}`)
            .then((response) => console.log(response));
          setRaidDetails(response.data);
          lcStore.setLoading(false);
        })
        .catch((ex) => {
          const err =
            ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";
          lcStore.setError(err);
          lcStore.setLoading(false);
        });
    }

    return function cleanup() {
      sub.unsubscribe();
    };
  }, [selectedFilter, raidID, raids.length]);

  return (
    <main className="wrapper">
      <header>
        <h1 className="pink">Raid Overview</h1>
      </header>

      {raids.length ? (
        <form>
          <select
            className="pink"
            value={selectedFilter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">Please Select a Raid</option>
            {raids.map((cl: RoleRankClass) => (
              <option key={cl.id} value={cl.id}>
                {cl.title}
              </option>
            ))}
          </select>
        </form>
      ) : null}

      {raidDetails.length ? (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Member</th>
            </tr>
          </thead>
          <tbody>
            {raidDetails.map((item: Loot) => {
              return (
                <tr key={item.id}>
                  <td>{item.item}</td>
                  <td>
                    <Link to={`/member/${item.id}`}>{item.member}</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </main>
  );
};

export default Raids;
