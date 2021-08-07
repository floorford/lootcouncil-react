import { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

import lcStore from "../store/lc";
import { IState, Member } from "../types";
import MemberCard from "../components/Member";
import LootTable from "../components/LootTable";
import "../css/lootcouncil.css";
import axiosAPI from "../axios";
import Stats from "../components/Stats";

const LootCouncil = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<MemberLabel | null>();
  const storedState = sessionStorage.getItem("state");
  const [
    { members, lcPlayers, loading, error, raids, items, attendance, events },
    setDataState,
  ] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  const memberOptions = members.map((member) => {
    return { ...member, value: member.id, label: member.member };
  });

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

    if (!raids.length)
      axios
        .all([axiosAPI.get(`/tabs/raids`)])
        .then(
          axios.spread((raids) => {
            lcStore.setRaids(raids.data);
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

    if (!events.length)
      axios
        .all([axiosAPI.get(`/tabs/events`), axiosAPI.get(`/tabs/attendance`)])
        .then(
          axios.spread((events, attendance) => {
            lcStore.setEvents(events.data, attendance.data);
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
  }, [members, raids, items, events]);

  useEffect(() => {
    const newPlayers = JSON.parse(localStorage.getItem("lcPlayers") || "[]");
    lcStore.setPlayers(newPlayers);
  }, []);

  type MemberLabel = Member & { value: string; label: string };
  const addPlayer = (chosenPlayer: MemberLabel | null): void => {
    if (chosenPlayer) {
      const newPlayers = lcPlayers.concat(chosenPlayer);
      lcStore.setPlayers(newPlayers);
      localStorage.setItem("lcPlayers", JSON.stringify(newPlayers));
      lcStore.setLoading(false);
      setSelectedPlayer(null);
    } else {
      lcStore.setError("No player could be found");
      lcStore.setLoading(false);
    }
  };

  const deletePlayer = (player: Member) => {
    const newPlayers = lcPlayers.filter((x) => x.id !== player.id);
    lcStore.setPlayers(newPlayers);
    localStorage.setItem("lcPlayers", JSON.stringify(newPlayers));
  };

  return (
    <main className="wrapper">
      <header className="pink">
        <h1>Loot Council</h1>
        <h4>Add players using the search below to compare</h4>
      </header>
      <div className="flex search">
        <Select
          className="pink select"
          options={memberOptions}
          isClearable
          isSearchable
          value={
            memberOptions.find(
              (member) => member.value === selectedPlayer?.value
            ) || []
          }
          placeholder="Enter a player..."
          onChange={(selectedPlayer) => addPlayer(selectedPlayer)}
        />
      </div>
      {loading && <p className="pink">Loading...</p>}
      {error && <p className="pink">{error}</p>}

      <section className="grid">
        {lcPlayers.length
          ? lcPlayers.map((member: Member, i: number) => {
              const memberLoot = items.filter(
                (item) => item.member_id === member.id
              );
              const memberAttendance = attendance.filter(
                (att) => att.member_id === member.id
              );
              return (
                <section key={i} className={`lc ${member.class}`}>
                  <div className="float-right">
                    <i
                      className="fas fa-lg fa-times"
                      onClick={() => deletePlayer(member)}
                    ></i>
                  </div>
                  <MemberCard member={member} interactive={true} propClass="" />

                  <div className="collapsible">
                    <Stats
                      member={member}
                      raidTotal={raids.length}
                      totalLoot={memberLoot}
                      attendance={memberAttendance}
                    />
                    <LootTable
                      items={memberLoot}
                      maxHeight={350}
                      playerClass={member.class}
                      raids={raids}
                    />
                  </div>
                </section>
              );
            })
          : null}
      </section>
    </main>
  );
};

export default LootCouncil;
