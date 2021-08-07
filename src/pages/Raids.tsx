import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { RoleRankClass, IState, Item } from "../types";
import lcStore from "../store/lc";
import axios from "axios";
import axiosAPI from "../axios";

const Raids = () => {
  const [relevantItems, setRelevantItems] = useState<Item[]>([]);

  const location = useLocation();
  const [selectedFilter, setFilter] = useState<string>(
    location.pathname.replace(/[^0-9]+/, "")
  );
  const raidID = selectedFilter;

  const storedState = sessionStorage.getItem("state");
  const [{ members, items, raids }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState]);

  useEffect(() => {
    if (!raids.length) {
      axios
        .all([axiosAPI.get(`/tabs/raids`)])
        .then(
          axios.spread((raids) => {
            lcStore.setRaids(raids.data);
            lcStore.setLoading(false);
            lcStore.setError("");
          })
        )
        .catch((ex) => {
          const err =
            ex.response.status === 404
              ? "Resource not found"
              : "An unexpected error has occurred";
          lcStore.setError(err);
          lcStore.setLoading(false);
        });
    }
  }, [raids, location.pathname]);

  useEffect(() => {
    if (raidID) {
      setRelevantItems(items.filter((item) => item.raid_id === raidID));
    }
  }, [raidID, location.pathname]);

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

      {relevantItems.length ? (
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Member</th>
            </tr>
          </thead>
          <tbody>
            {relevantItems.map((item) => {
              const member = members.find(
                (member) => member.id === item.member_id
              );
              return (
                <tr key={item.id}>
                  <td>
                    <a
                      target="_blank"
                      href={`https://tbc.wowhead.com/item=${item.item_id}`}
                    >
                      {item.title}
                    </a>
                  </td>
                  <td>
                    <Link to={`/members/id/${member?.id}`}>
                      {member?.member}
                    </Link>
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
