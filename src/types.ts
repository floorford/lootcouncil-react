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

export type Detail = {
  item: string;
  title: string;
  id: number;
};

export type Attendance = {
  no_show: string;
  late: string;
  passed_spot: string;
};

export interface IState {
  members: Array<Member>;
  roles: Array<RoleRankClass>;
  ranks: Array<RoleRankClass>;
  classes: Array<RoleRankClass>;
  raids: Array<RoleRankClass>;
  selectedMember: Member;
  loading: boolean;
  error: string;
  lcPlayers: [];
  [key: string]: any;
}

export interface IData {
  members: Array<MemberData>;
  roles: Array<RoleRankClass>;
  ranks: Array<RoleRankClass>;
  classes: Array<RoleRankClass>;
}
export interface IFormField {
  title: string;
  fields: Array<IField>;
}
export interface IField {
  label: string;
  id: string;
}

export type MemberProps = {
  member: Member;
  interactive: boolean;
  propClass: string;
};

export type StatsProps = {
  member: Member;
  raidTotal: number;
  totalLoot: Array<Detail>;
  attendance: Attendance;
};

export type LootTableProps = {
  details: Array<Detail>;
  playerClass: string;
  maxHeight: number;
};

export type Loot = {
  item: string;
  id: number;
  member: string;
};

export type FormProps = {
  formFields: IFormField;
};
