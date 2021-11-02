import { useEffect, useLayoutEffect, useState } from "react";
import { IState } from "../types";
import lcStore from "../store/lc";
import axios from "axios";
import axiosAPI from "../axios";
import Select from "react-select";

const Raids = () => {
  const storedState = sessionStorage.getItem("state");
  const [{ raids, loading, error }, setDataState] = useState<IState>(
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
      lcStore.setLoading(true);

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

    return function cleanup() {
      sub.unsubscribe();
    };
  }, [raids]);

  const raidOptions = raids.map((raid) => {
    return {
      ...raid,
      value: raid.id,
      label: `${raid.title} (${new Date(raid.date).toLocaleDateString()})`,
      isDisabled: !raid.log,
    };
  });

  return (
    <main className="wrapper">
      <header>
        <h1 className="pink">Raid Logs</h1>
      </header>

      <p className="pink">
        Select a raid below to see the logs. If it is greyed out no logs are
        available.
      </p>

      {raids.length ? (
        <div className="flex search">
          <Select
            className="pink select"
            options={raidOptions}
            isClearable
            isSearchable
            isOptionDisabled={(option) => option.isDisabled}
            placeholder="Enter or select a raid..."
            onChange={(selectedRaid) =>
              selectedRaid?.log ? window.open(selectedRaid.log, "_blank") : null
            }
          />
        </div>
      ) : null}

      {loading && <p className="pink">Loading...</p>}
      {error && <p className="pink">{error}</p>}
    </main>
  );
};

export default Raids;
