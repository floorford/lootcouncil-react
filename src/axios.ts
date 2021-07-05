import axios from "axios";

export default axios.create({
  baseURL: "https://sheet.best/api/sheets/70c3377f-b2ef-4e62-8709-93d817d4c366",
  headers: {
    "Content-Type": "application/json",
  },
});
