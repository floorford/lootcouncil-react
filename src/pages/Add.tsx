import { useState } from "react";

import { formOptions } from "../helper";
import { IFormField } from "../types";

import Form from "../components/Form";

const Add = () => {
  const [selectedForm, setForm] = useState(formOptions[0]);

  const setFormChoice = (value: string): void => {
    const choiceIndex = formOptions.findIndex((x) => x.title === value);
    setForm(formOptions[choiceIndex]);
  };

  return (
    <main className="wrapper">
      <header className="pink">
        <h1>Data Entry</h1>
        <h4>
          Select and use a form below to add a raid, players and attendance
        </h4>

        <select
          className="pink"
          value={selectedForm.title}
          onChange={(e) => setFormChoice(e.target.value)}
        >
          <option value="">Please Select a Form</option>
          {formOptions.map((form: IFormField, i: number) => (
            <option key={i} value={form.title}>
              {form.title}
            </option>
          ))}
        </select>

        <Form formFields={selectedForm} />
      </header>
    </main>
  );
};

export default Add;
