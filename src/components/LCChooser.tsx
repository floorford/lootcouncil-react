import axios from "axios";
import { useEffect, useLayoutEffect, useState } from "react";
import lcStore from "../store/lc";
import { IState, Member } from "../types";
import axiosAPI from "../axios";

const LCChooser = () => {
  const [lcCandidates, setLCCanditates] = useState<Member[]>([]);
  const [officerIndex, setOfficerIndex] = useState<number>(0);
  const [meleeIndex, setMeleeIndex] = useState<number>(0);
  const [rangedIndex, setRangedIndex] = useState<number>(0);
  const [healerIndex, setHealerIndex] = useState<number>(0);

  const storedState = sessionStorage.getItem("state");
  const [{ members, loading, error }, setDataState] = useState<IState>(
    storedState ? JSON.parse(storedState) : lcStore.initialState
  );

  useEffect(() => {
    const lcCandidates = members.filter(
      (member) =>
        Boolean(+member.lc_willing) &&
        member.member !== "Chickun" &&
        Boolean(+member.active_raider)
    );
    setLCCanditates(lcCandidates);
  }, [members]);

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
    return function cleanup() {
      sub.unsubscribe();
    };
  }, [members]);

  const officers = lcCandidates.filter((member) => member.rank === "Officer");
  const rest = lcCandidates.filter((member) => member.rank !== "Officer");

  const melee = rest.filter(
    (member) => member.role === "melee" || member.role === "tank"
  );
  const healers = rest.filter((member) => member.role === "healer");

  const ranged = rest.filter(
    (member) => member.role === "ranged" || member.role === "caster"
  );

  useEffect(() => {
    setOfficerIndex(Math.floor(Math.random() * officers.length));
    setMeleeIndex(Math.floor(Math.random() * melee.length));
    setHealerIndex(Math.floor(Math.random() * healers.length));
    setRangedIndex(Math.floor(Math.random() * ranged.length));
  }, [officers.length, melee.length, healers.length, ranged.length]);

  const handleSetIndex = (member: Member) => {
    if (member.rank === "Officer")
      return setOfficerIndex(Math.floor(Math.random() * officers.length));

    if (member.role === "tank" || member.role === "melee")
      return setMeleeIndex(Math.floor(Math.random() * melee.length));

    if (member.role === "healer")
      return setHealerIndex(Math.floor(Math.random() * healers.length));

    if (member.role === "ranged" || member.role === "caster")
      return setRangedIndex(Math.floor(Math.random() * ranged.length));
  };

  const team = lcCandidates.length
    ? [
        officers[officerIndex],
        melee[meleeIndex],
        healers[healerIndex],
        ranged[rangedIndex],
      ]
    : [];

  return (
    <main className="wrapper">
      <header className="pink">
        <h1>Loot Council Generator</h1>
      </header>

      {loading && <p className="pink">Loading...</p>}
      {error && <p className="pink">{error}</p>}

      <div>
        <h4 className="pink">This week's team is:</h4>
        <div>
          <div>
            {team.length ? (
              <>
                <span className={`member druid`}>Chickun</span>
                {team.map((member, i) => (
                  <span
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className={`member ${member.class}`}
                  >
                    {member.member}
                    <button
                      style={{
                        cursor: "pointer",
                        backgroundColor: "inherit",
                        border: "none",
                      }}
                      onClick={() => handleSetIndex(member)}
                    >
                      <i className="fas fa-dice"></i>
                    </button>
                  </span>
                ))}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LCChooser;
