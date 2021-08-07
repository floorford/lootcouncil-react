import axios from "axios";

export default axios.create({
  // baseURL: "https://sheet.best/api/sheets/70c3377f-b2ef-4e62-8709-93d817d4c366",
  baseURL: "https://api.steinhq.com/v1/storages/610ee6e347873c2b732aac38",
  headers: {
    "Content-Type": "application/json",
  },
});
