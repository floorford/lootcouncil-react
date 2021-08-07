import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import lcStore from "../store/lc";
import { IState, Member } from "../types";
import MemberCard from "../components/Member";
import axiosAPI from "../axios";

const Overview = (): JSX.Element => {
  const storedState = sessionStorage.getItem("state");
  const [{ error, loading, members }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  useLayoutEffect(() => {
    const storedState = sessionStorage.getItem("state");
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState]);

  useEffect(() => {
    lcStore.init();
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

  const tanks = members.filter((mem) => mem.role === "tank");
  const healers = members.filter((mem) => mem.role === "healer");
  const dps = members
    .filter((mem) => mem.role !== "healer" && mem.role !== "tank")
    .sort(function (a, b) {
      if (a.class < b.class) {
        return 1;
      }
      if (a.class > b.class) {
        return -1;
      }

      return 0;
    });

  return (
    <main className="wrapper">
      {tanks.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-shield-alt"></i>
            TANKS ({tanks.length})
          </p>
          <div className="flex">
            {tanks.map((member: Member) => (
              <MemberCard
                key={member.id}
                member={member}
                interactive={true}
                propClass=""
              />
            ))}
          </div>
        </section>
      ) : null}
      {healers.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-medkit"></i>
            HEALERS ({healers.length})
          </p>
          <div className="flex">
            {healers.map((member: Member) => (
              <MemberCard
                key={member.id}
                member={member}
                interactive={true}
                propClass=""
              />
            ))}
          </div>
        </section>
      ) : null}
      {dps.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-skull-crossbones"></i> DPS ({dps.length})
          </p>
          <div className="flex">
            {dps.map((member: Member) => (
              <MemberCard
                key={member.id}
                member={member}
                interactive={true}
                propClass=""
              />
            ))}
          </div>
        </section>
      ) : null}
      {loading && <p className="pink">Loading...</p>}
      {error && <p className="pink">{error}</p>}
    </main>
  );
};

export default Overview;
