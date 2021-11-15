import { useEffect, useState } from "react";
import axios from "axios";
import lcStore from "../store/lc";
import { IState, Member } from "../types";
import MemberCard from "../components/Member";
import axiosAPI from "../axios";
import "../css/checkbox.css";
import Checkbox from "../components/Checkbox";

const Overview = (): JSX.Element => {
  const storedState = sessionStorage.getItem("state");
  const [{ error, loading, members }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  const [isActiveRaiders, toggleIsActiveRaiders] = useState(false);

  useEffect(() => {
    setDataState(storedState ? JSON.parse(storedState) : lcStore.initialState);
  }, [setDataState, storedState]);

  useEffect(() => {
    const sub = lcStore.subscribe(setDataState);
    lcStore.init();
    if (!members.length) {
      lcStore.setLoading(true);

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

  const classSorter = (a: Member, b: Member) => {
    if (a.className < b.className) {
      return 1;
    }
    if (a.className > b.className) {
      return -1;
    }
    return 0;
  };

  const tanks = members
    .filter((mem) => mem.role === "tank")
    .filter((member) => {
      if (isActiveRaiders) return member.active_raider === "1";
      return true;
    })
    .sort(classSorter);

  const healers = members
    .filter((mem) => mem.role === "healer")
    .filter((member) => {
      if (isActiveRaiders) return member.active_raider === "1";
      return true;
    })
    .sort(classSorter);

  const melee = members
    .filter((mem) => mem.role === "melee")
    .filter((member) => {
      if (isActiveRaiders) return member.active_raider === "1";
      return true;
    })
    .sort(classSorter);

  const ranged = members
    .filter((mem) => mem.role === "ranged")
    .filter((member) => {
      if (isActiveRaiders) return member.active_raider === "1";
      return true;
    })
    .sort(classSorter);

  const caster = members
    .filter((mem) => mem.role === "caster")
    .filter((member) => {
      if (isActiveRaiders) return member.active_raider === "1";
      return true;
    })
    .sort(classSorter);

  return (
    <main className="wrapper">
      <div>
        <Checkbox
          label="Active Raiders"
          handleToggle={() => toggleIsActiveRaiders(!isActiveRaiders)}
          isChecked={isActiveRaiders}
        />
      </div>
      {tanks.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-shield-alt"></i>
            TANKS ({tanks.length})
          </p>
          <div className="flex">
            {tanks.map((member) => (
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
      {melee.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-skull-crossbones"></i> Melee DPS (
            {melee.length})
          </p>
          <div className="flex">
            {melee.map((member: Member) => (
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
      {ranged.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-skull-crossbones"></i> Ranged DPS (
            {ranged.length})
          </p>
          <div className="flex">
            {ranged.map((member: Member) => (
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
      {caster.length ? (
        <section>
          <p className="team-role">
            <i className="fas fa-skull-crossbones"></i> Casters ({caster.length}
            )
          </p>
          <div className="flex">
            {caster.map((member: Member) => (
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
