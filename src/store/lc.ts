import { Subject } from "rxjs";
import {
  IState,
  Member,
  IData,
  RoleRankClass,
  MemberData,
  Item,
  Attendance,
  MappedAttendance,
  Raid,
} from "../types";

// An RxJS Subject can act as both an Observable and an Observer at the same time
// when a Subject receives any data, that data can be forwarded to every Observer subscribed to it
const subject = new Subject();

const initialState: IState = {
  members: [],
  roles: [],
  ranks: [],
  classes: [],
  raids: [],
  events: [],
  items: [],
  attendance: [],
  selectedMember: {
    id: "",
    member: "",
    class: "",
    rank: "",
    role: "",
    prev_raids: "",
    absence: "",
    six_months: false,
  },
  loading: false,
  lcPlayers: [],
  error: "",
};

let state = initialState;

// Subscribing different React Hooks setState functions to our RxJS Subject
// so that when it receives any data, it forwards that data to every state associated with our
// setState function.
const lcStore = {
  // initialize our component’s state whenever it’s mounted
  init: () => subject.next(state),
  subscribe: (setState: any) => subject.subscribe(setState),
  setData: (data: IData) => {
    // @ts-ignore
    const members = data.members.reduce((acc: Member[], val: MemberData) => {
      const { class_id, role_id, rank_id, ...memberData } = val;
      const formattedData: Member = {
        ...memberData,
        six_months: memberData.six_months,
        class: data.classes.find((cl) => cl.id === class_id)!.title,
        role: data.roles.find((r) => r.id === role_id)!.title,
        rank: data.ranks.find((ra) => ra.id === rank_id)!.title,
      };

      acc.push(formattedData);
      return acc;
    }, []) as unknown;

    state = {
      ...state,
      members: members as Member[],
      roles: data.roles,
      ranks: data.ranks,
      classes: data.classes,
    };

    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setPlayers: (newPlayers: any) => {
    state = {
      ...state,
      lcPlayers: newPlayers,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setMember: (member: Member) => {
    state = {
      ...state,
      selectedMember: member,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setItems: (items: Item[]) => {
    state = {
      ...state,
      items,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setEvents: (events: Array<RoleRankClass>, attendance: Array<Attendance>) => {
    const mappedAttendance = attendance.reduce<MappedAttendance[]>(
      (acc, { id, member_id, raid_id, event_id }) => {
        const eventTitle = events.find((event) => event.id === event_id);
        const newAttendance = {
          id,
          member_id,
          raid_id,
          event: eventTitle ? eventTitle.title : "",
        };
        acc.push(newAttendance);
        return acc;
      },
      []
    );
    state = {
      ...state,
      attendance: mappedAttendance,
      events,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setRaids: (raids: Array<Raid>) => {
    state = {
      ...state,
      raids,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setLoading: (boolean: boolean) => {
    state = {
      ...state,
      loading: boolean,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  setError: (message: string) => {
    state = {
      ...state,
      error: message,
    };
    sessionStorage.setItem("state", JSON.stringify(state));
    subject.next(state);
  },
  initialState,
};

export default lcStore;
