import { useState, useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import lcStore from "../store/lc";
import axiosAPI from "../axios";

import { IState, Detail, Attendance } from "../types";
import MemberCard from "./Member";
import LootTable from "./LootTable";
import Stats from "./Stats";

import "../css/player.css";

const Player = (): JSX.Element => {
  const storedState = sessionStorage.getItem("state");

  const [{ selectedMember, events }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );
  const [details, setDetails] = useState<Detail[]>([]);
  const [raidTotal, setRaidTotal] = useState<number>(0);
  const [attendance, setAttendance] = useState<Attendance>({
    passed_spot: "0",
    late: "0",
    no_show: "0",
  });

  const location = useLocation();

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState]);

  useEffect(() => {
    if (!events.length)
      axios
        .all([
          axiosAPI.get(`/tabs/raids`),
          axiosAPI.get(`/tabs/events`),
          axiosAPI.get(`/tabs/attendance/member_id/${selectedMember.id}`),
        ])
        .then(
          axios.spread((raids, events, attendance) => {
            console.log(events.data);
            // setDetails(response.data.details);
            setRaidTotal(raids.data.length);
            lcStore.setEvents(events.data);
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
  }, [location.pathname]);

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
          raidTotal={raidTotal}
          totalLoot={details}
          attendance={attendance}
        />

        <LootTable
          details={details}
          maxHeight={750}
          playerClass={selectedMember.class}
        />
      </section>
    </main>
  );
};

export default Player;
