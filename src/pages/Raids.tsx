import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import { IState, Item, Member } from "../types";
import lcStore from "../store/lc";
import axios from "axios";
import axiosAPI from "../axios";
import Select from "react-select";

const Raids = () => {
  const [relevantItems, setRelevantItems] = useState<Item[]>([]);

  const history = useHistory();

  const location = useLocation();
  const [raidID, setFilter] = useState<string | undefined>(
    location.pathname.replace(/[^0-9]+/, "")
  );

  const storedState = sessionStorage.getItem("state");
  const [{ members, items, raids }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState, storedState]);

  useEffect(() => {
    lcStore.init();
    const sub = lcStore.subscribe(setDataState);

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

    if (!items.length)
      axios
        .all([axiosAPI.get(`/tabs/items`)])
        .then(
          axios.spread((items) => {
            lcStore.setItems(items.data);

            lcStore.setLoading(false);
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

    return function cleanup() {
      sub.unsubscribe();
    };
  }, [raids, items]);

  useEffect(() => {
    if (raidID) {
      console.log(items, raidID);
      setRelevantItems(items.filter((item) => item.raid_id === raidID));
    }
  }, [raidID, items]);

  const raidOptions = raids.map((raid) => {
    return { ...raid, value: raid.id, label: `${raid.title} (${raid.date})` };
  });

  const selectMember = (member: Member) => {
    lcStore.setMember(member);
    history.push(`/members/id/${member.id}`);
  };

  return (
    <main className="wrapper">
      <header>
        <h1 className="pink">Raid Overview</h1>
      </header>

      {raids.length ? (
        <div className="flex search">
          <Select
            className="pink select"
            options={raidOptions}
            isClearable
            isSearchable
            placeholder="Enter or select a raid..."
            onChange={(selectedRaid) => setFilter(selectedRaid?.id)}
          />
        </div>
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
                      rel="noreferrer"
                      href={`https://tbc.wowhead.com/item=${item.item_id}`}
                    >
                      {item.title}
                    </a>
                  </td>
                  {member && (
                    <td>
                      <Link
                        onClick={() => selectMember(member)}
                        to={`/members/id/${member?.id}`}
                      >
                        {member?.member}
                      </Link>
                    </td>
                  )}
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
