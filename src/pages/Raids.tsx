import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { IState, Item } from "../types";
import lcStore from "../store/lc";
import axios from "axios";
import axiosAPI from "../axios";
import Select from "react-select";
import LootTable from "../components/LootTable";

const Raids = () => {
  const [relevantItems, setRelevantItems] = useState<Item[]>([]);

  const location = useLocation();
  const [raidID, setFilter] = useState<string | undefined>(
    location.pathname.replace(/[^0-9]+/, "")
  );

  const storedState = sessionStorage.getItem("state");
  const [{ items, raids, members }, setDataState] = useState<IState>(
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
        .all([axiosAPI.get(`/raids`)])
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
        .all([axiosAPI.get(`/items`)])
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
      setRelevantItems(items.filter((item) => item.raid_id === raidID));
    }
  }, [raidID, items]);

  const raidOptions = raids.map((raid) => {
    return {
      ...raid,
      value: raid.id,
      label: `${raid.title} (${new Date(raid.date).toLocaleDateString()})`,
    };
  });

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
        <LootTable
          items={relevantItems}
          raids={raids}
          forOverview={true}
          members={members}
        />
      ) : null}

      {raidID && !relevantItems.length && (
        <p className="pink">
          This raid was before loot council, or is not currently loot councilled
        </p>
      )}
    </main>
  );
};

export default Raids;
