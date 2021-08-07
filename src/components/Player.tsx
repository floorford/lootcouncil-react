import { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState]);

  useEffect(() => {
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
  }, [location.pathname, raids, items, events]);

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
          raidTotal={raids.length}
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
