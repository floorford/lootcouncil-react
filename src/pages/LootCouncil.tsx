import { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import lcStore from "../store/lc";
import { Attendance, IState } from "../types";
import MemberCard from "../components/Member";
import Stats from "../components/Stats";
import LootTable from "../components/LootTable";
import "../css/lootcouncil.css";
import axiosAPI from "../axios";

const LootCouncil = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const storedState = sessionStorage.getItem("state");
  const [{ members, lcPlayers, loading, error, raids }, setDataState] =
    useState<IState>(
      storedState ? JSON.parse(storedState) : lcStore.initialState
    );

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState]);

  useEffect(() => {
    const sub = lcStore.subscribe(setDataState);
    if (!members.length) {
      axios
        .all([
          axiosAPI.get(""),
          axiosAPI.get("/tabs/roles"),
          axiosAPI.get("/tabs/ranks"),
          axiosAPI.get("/tabs/classes"),
        ])
        .then(
          axios.spread((members, roles, ranks, classes) => {
            lcStore.setData({
              members: members.data,
              roles: roles.data,
              ranks: ranks.data,
              classes: classes.data,
            });
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
  }, [members.length]);

  useEffect(() => {
    const newPlayers = JSON.parse(localStorage.getItem("lcPlayers") || "[]");
    lcStore.setPlayers(newPlayers);
  }, []);

  const submitSearch = (e: React.SyntheticEvent): void => {
    e.preventDefault();

    const chosenPlayer = members.find(
      (member) =>
        member.member.toLocaleLowerCase() === searchTerm.toLocaleLowerCase()
    );

    if (chosenPlayer !== undefined) {
      const newPlayers = lcPlayers.concat(chosenPlayer);
      lcStore.setPlayers(newPlayers);
      localStorage.setItem("lcPlayers", JSON.stringify(newPlayers));
      lcStore.setLoading(false);
      setSearchTerm("");
    } else {
      lcStore.setError("No player could be found");
      lcStore.setLoading(false);
    }
  };

  const deletePlayer = (player: any) => {
    const newPlayers = lcPlayers.filter((x: any) => x.player.id !== player.id);
    lcStore.setPlayers(newPlayers);
    localStorage.setItem("lcPlayers", JSON.stringify(newPlayers));
  };

  console.log(members);
  return (
    <main className="wrapper">
      <header className="pink">
        <h1>Loot Council</h1>
        <h4>Add players using the search below to compare</h4>
      </header>
      <div className="flex search">
        <Select
          className="pink"
          options={members}
          isClearable
          isSearchable
          placeholder="Enter a player..."
        />
        <form onSubmit={(e) => submitSearch(e)}>
          <label htmlFor="search">
            <input
              type="search"
              id="search"
              className="pink"
              value={searchTerm}
              placeholder="Enter a player..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </label>
        </form>
        <button
          disabled={!searchTerm.length ? true : false}
          onClick={(e) => submitSearch(e)}
          type="button"
        >
          Add
        </button>
      </div>

      {loading && <p className="pink">Loading...</p>}
      {error && <p className="pink">{error}</p>}

      <section className="grid">
        {lcPlayers.length
          ? lcPlayers.map((x: any, i: number) => (
              <section key={i} className={`lc ${x.player.class}`}>
                <div className="float-right">
                  <i
                    className="fas fa-lg fa-times"
                    onClick={() => deletePlayer(x.player)}
                  ></i>
                </div>
                <MemberCard member={x.player} interactive={true} propClass="" />

                <div className="collapsible">
                  {/* <Stats
                    member={x.player}
                    raidTotal={raids.length}
                    totalLoot={x.playerLoot}
                    attendance={attendance}
                  /> */}
                  <LootTable
                    items={x.playerLoot}
                    maxHeight={350}
                    playerClass={x.player.class}
                    raids={raids}
                  />
                </div>
              </section>
            ))
          : null}
      </section>
    </main>
  );
};

export default LootCouncil;
