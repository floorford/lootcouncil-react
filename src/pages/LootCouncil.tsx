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
import LootCouncilCard from "../components/LootCouncilCard";

const LootCouncil = () => {
  const [selectedPlayer, setSelectedPlayer] = useState<MemberLabel | null>();
  const [lcPlayers, setLCPlayer] = useState<MemberLabel[]>([]);

  const storedState = sessionStorage.getItem("state");
  const [
    { members, loading, error, raids, items, attendance, events },
    setDataState,
  ] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  const memberOptions = members
    .filter((member) =>
      lcPlayers.length ? lcPlayers.find((lcP) => lcP.id !== member.id) : true
    )
    .map((member) => {
      return { ...member, value: member.id, label: member.member };
    });

  useLayoutEffect(() => {
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState, storedState]);

  useEffect(() => {
    const sub = lcStore.subscribe(setDataState);
    if (!members.length) {
      axios
        .all([
          axiosAPI.get(""),
          axiosAPI.get("/roles"),
          axiosAPI.get("/ranks"),
          axiosAPI.get("/classes"),
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
        .all([axiosAPI.get(`/raids`)])
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

    if (!events.length)
      axios
        .all([axiosAPI.get(`/events`), axiosAPI.get(`/attendance`)])
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
  }, [members, raids, events]);

  type MemberLabel = Member & { value: string; label: string };
  const addPlayer = (chosenPlayer: MemberLabel | null): void => {
    if (chosenPlayer) {
      const newPlayers = lcPlayers.concat(chosenPlayer);
      lcStore.setLoading(false);
      setSelectedPlayer(null);
      setLCPlayer(newPlayers);

      if (!items.filter((item) => item.member_id === chosenPlayer.id).length) {
        axios.all([axiosAPI.get(`/${chosenPlayer.member}`)]).then(
          axios.spread((memberItems) => {
            lcStore.setItems([...items, ...memberItems.data]);
            lcStore.setLoading(false);
          })
        );
      }
    }
  };

  const deletePlayer = (index: number) => {
    const newPlayers = lcPlayers.filter((_, i) => i !== index);
    setLCPlayer(newPlayers);
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
                <LootCouncilCard
                  member={member}
                  raids={raids}
                  memberLoot={memberLoot}
                  memberAttendance={memberAttendance}
                  deletePlayer={() => deletePlayer(i)}
                />
              );
            })
          : null}
      </section>
    </main>
  );
};

export default LootCouncil;
