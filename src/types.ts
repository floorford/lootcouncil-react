export type Member = {
  id: string;
  member: string;
  class: string;
  rank: string;
  role: string;
  lc_willing: string;
  absence: string;
  six_months: string;
  count_from: string;
  active_raider: string;
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
  log: string | null;
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
  items: Item[];
  [key: string]: any;
};

export type IData = {
  members: Array<Member>;
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
  raids: Raid[];
  totalLoot: Array<Item>;
  attendance: MappedAttendance[];
};

export type LootTableProps = {
  items: Array<Item>;
  playerClass?: string;
  maxHeight?: number;
  raids: Raid[];
  forOverview?: boolean;
  members?: Member[];
};

export type Loot = {
  item: string;
  id: number;
  member: string;
};

export type FormProps = {
  formFields: IFormField;
};
