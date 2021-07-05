import { FormProps } from "../types";

const Form = ({ formFields }: FormProps): JSX.Element => {
  return formFields ? (
    <form>
      <h3 className="pink">{formFields.title}</h3>
      {formFields.fields.map((x, i) => {
        return (
          <section key={i}>
            <label>{x.label}</label>
            <input name={x.id} id={x.id} type="text" />
          </section>
        );
      })}
      <input name="id" id="id" type="hidden" />
    </form>
  ) : (
    <p className="pink">Sorry something went wrong!</p>
  );
};

export default Form;
