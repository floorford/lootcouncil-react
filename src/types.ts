export type Member = {
  id: string;
  member: string;
  class: string;
  rank: string;
  role: string;
  prev_raids: string;
  absence: string;
  six_months: boolean;
  [key: string]: any;
};

export type MemberData = {
  id: string;
  member: string;
  class_id: string;
  rank_id: string;
  role_id: string;
  prev_raids: string;
  absence: string;
  six_months: boolean;
  [key: string]: any;
};

export type RoleRankClass = {
  id: string;
  title: string;
};

export type Raid = {
  id: string;
  title: string;
  date: string;
};

export type Item = {
  item_id: string;
  title: string;
  id: number;
  member_id: string;
  raid_id: string;
  spec: string;
};

export type Attendance = {
  id: string;
  event_id: string;
  member_id: string;
  raid_id: string;
};

export type MappedAttendance = {
  id: string;
  event: string;
  member_id: string;
  raid_id: string;
};

export type IState = {
  members: Member[];
  roles: RoleRankClass[];
  ranks: RoleRankClass[];
  classes: RoleRankClass[];
  raids: Raid[];
  events: RoleRankClass[];
  attendance: MappedAttendance[];
  selectedMember: Member;
  loading: boolean;
  error: string;
  lcPlayers: Member[];
  items: Item[];
  [key: string]: any;
};

export type IData = {
  members: Array<MemberData>;
  roles: Array<RoleRankClass>;
  ranks: Array<RoleRankClass>;
  classes: Array<RoleRankClass>;
};

export type IFormField = {
  title: string;
  fields: Array<IField>;
};

export type IField = {
  label: string;
  id: string;
};

export type MemberProps = {
  member: Member;
  interactive: boolean;
  propClass: string;
};

export type StatsProps = {
  member: Member;
  raidTotal: number;
  totalLoot: Array<Item>;
  attendance: MappedAttendance[];
};

export type LootTableProps = {
  items: Array<Item>;
  playerClass: string;
  maxHeight: number;
  raids: Raid[];
};

export type Loot = {
  item: string;
  id: number;
  member: string;
};

export type FormProps = {
  formFields: IFormField;
};
