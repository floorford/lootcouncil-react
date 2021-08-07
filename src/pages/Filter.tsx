import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import axiosAPI from "../axios";
import lcStore from "../store/lc";
import { IState, RoleRankClass, Member } from "../types";
import { ucFirst } from "../helper";
import MemberCard from "../components/Member";

import "../css/filter.css";
import Select from "react-select";

const Filter = () => {
  const location = useLocation().pathname.slice(1);
  const [selectedFilter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    setFilter(null);
  }, [location]);

  const storedState = sessionStorage.getItem("state");
  const [data, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  useEffect(() => {
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState, storedState]);

  useEffect(() => {
    const sub = lcStore.subscribe(setDataState);
    lcStore.init();
    if (!data.members.length) {
      axios
        .all([
          axiosAPI.get("/members"),
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
            lcStore.setError("");
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
    }

    return function cleanup() {
      sub.unsubscribe();
    };
  }, [data.members.length]);

  const locationNameReady: string =
    location.slice(0, -1) === "classe" ? "class" : location.slice(0, -1);

  const filteredMembers = data.members.filter(
    (mem: Member) => mem[locationNameReady] === selectedFilter
  );

  const filter = data[location].map((data: RoleRankClass) => {
    return { ...data, value: data.title, label: ucFirst(data.title) };
  });

  return (
    <main className="wrapper">
      <header>
        <h1 className="pink">{ucFirst(locationNameReady)} Overview</h1>
      </header>

      {filter.length ? (
        <div className="flex search">
          <Select
            className="pink select"
            value={
              filter.find(
                (filter: { value: string | undefined }) =>
                  filter.value === selectedFilter
              ) || []
            }
            options={filter}
            isClearable
            isSearchable
            placeholder={`Please Select a ${ucFirst(locationNameReady)}`}
            onChange={(selected) => setFilter(selected?.value)}
          />
        </div>
      ) : null}

      {filteredMembers.length ? (
        <section className="flex">
          {filteredMembers.map((member: Member) => (
            <MemberCard
              key={member.id}
              member={member}
              interactive={true}
              propClass=""
            />
          ))}
        </section>
      ) : null}

      {data.loading && <p className="pink">Loading...</p>}

      {data.error && <p className="pink">{data.error}</p>}
    </main>
  );
};

export default Filter;
