import { useState, useEffect } from "react";
import axios from "axios";
import lcStore from "../store/lc";
import axiosAPI from "../axios";

import { IState } from "../types";
import MemberCard from "./Member";
import LootTable from "./LootTable";
import Stats from "./Stats";

import "../css/player.css";

const Player = (): JSX.Element => {
  const storedState = sessionStorage.getItem("state");
  const [{ selectedMember, events, items, raids, attendance }, setDataState] =
    useState<IState>(
      storedState ? JSON.parse(storedState) : lcStore.initialState
    );

  useEffect(() => {
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState, storedState]);

  useEffect(() => {
    const sub = lcStore.subscribe(setDataState);
    lcStore.init();
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
  }, [events, items, raids]);

  const memberLoot = items.filter(
    (item) => item.member_id === selectedMember.id
  );

  const memberAttendance = attendance.filter(
    (att) => att.member_id === selectedMember.id
  );

  return (
    <main className="wrapper">
      <MemberCard
        member={selectedMember}
        interactive={false}
        propClass="header"
      />

      <section className="flex player-wrapper">
        <Stats
          member={selectedMember}
          raids={raids}
          totalLoot={memberLoot}
          attendance={memberAttendance}
        />

        <LootTable
          items={memberLoot}
          maxHeight={750}
          playerClass={selectedMember.class}
          raids={raids}
        />
      </section>
    </main>
  );
};

export default Player;
