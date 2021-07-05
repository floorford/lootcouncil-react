import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import lcStore from "../store/lc";
import { IState, IData, RoleRankClass, Member } from "../types";
import { ucFirst } from "../helper";
import MemberCard from "../components/Member";

import "../css/filter.css";

const Filter = () => {
  const location = useLocation().pathname.slice(1);
  const [data, setDataState] = useState<IState>(lcStore.initialState);
  const [selectedFilter, setFilter] = useState<string>("");

  useEffect(() => {
    lcStore.init();
    const sub = lcStore.subscribe(setDataState);

    if (!data.members.length) {
      axios
        .get<IData>("/api/members", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          lcStore.setData(response.data);
          lcStore.setLoading(false);
        })
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

  let filter = data[location];
  return (
    <main className="wrapper">
      <header>
        <h1 className="pink">{ucFirst(locationNameReady)} Overview</h1>
      </header>

      {filter.length ? (
        <form>
          <select
            className="pink"
            value={selectedFilter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="">
              Please Select a {ucFirst(locationNameReady)}
            </option>
            {filter.map((cl: RoleRankClass) => (
              <option key={cl.id} value={cl.title}>
                {ucFirst(cl.title)}
              </option>
            ))}
          </select>
        </form>
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
