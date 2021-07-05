export const ucFirst = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

// player
// raid
export const formOptions = [
  {
    title: "Player",
    fields: [
      { label: "Name", id: "member" },
      { label: "Class", id: "class_id" },
      { label: "Role", id: "role_id" },
      { label: "Rank", id: "rank_id" },
    ],
  },
  {
    title: "Raid",
    fields: [{ label: "Name", id: "member" }],
  },
];
