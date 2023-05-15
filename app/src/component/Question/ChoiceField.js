import React  from "react";
import './EditQuestion.css'

function InputField({ id, value, onChange}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      type="text"
    />
  );
}

function SelectBox({ id, value, onChange, options }) {
  return (
    <select id={id} value={value} onChange={onChange}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ChoiceField({label, text, setText, grade, setGrade}) {

  return (
    <div className="choice-field">
      <div className="row">
          <div className="col-20">
            <label >{label}</label>
          </div>
          <div className="col-80">
            <InputField
        value={text}
        onChange={(e) => setText(e.target.value)}
            />
          </div>
      </div>

      <div className="row">
          <div className="col-20">
          <label>Grade</label>
          </div>
          <div className="col-80">
          <SelectBox
        value={grade}
        onChange={(e) => setGrade(e.target.value)}
        options={[
          { value: "none", label: "None" },
          { value: "1", label: "100%" },
          { value: "0.9", label: "90%" },
          { value: "0.833333", label: "83.33333%" },
          { value: "0.8", label: "80%" },
          { value: "0.75", label: "75%" },
          { value: "0.7", label: "70%" },
          { value: "0.666667", label: "66.66667%" },
          { value: "0.6", label: "60%" },
          { value: "0.5", label: "50%" },
          { value: "0.4", label: "40%" },
          { value: "0.333333", label: "33.33333%" },
          { value: "0.3", label: "30%" },
          { value: "0.25", label: "25%" },
          { value: "0.2", label: "20%" },
          { value: "0.166667", label: "16.66667%" },
          { value: "0.142857", label: "14.28571%" },
          { value: "0.125", label: "12.5%" },
          { value: "0.111111", label: "11.11111%" },
          { value: "0.1", label: "10%" },
          { value: "-0.05", label: "-5%" },
          { value: "-0.1", label: "-10%" },
          { value: "-0.111111", label: "-11.11111%" },
          { value: "-0.125", label: "-12.5%" },
          { value: "-0.142857", label: "-14.28571%" },
          { value: "-0.166667", label: "-16.66667%" },
          { value: "-0.2", label: "-20%" },
          { value: "-0.25", label: "-25%" },
          { value: "-0.3", label: "-30%" },
          { value: "-0.333333", label: "-33.33333%" },
          { value: "-0.4", label: "-40%" },
          { value: "-0.5", label: "-50%" },
          { value: "-0.6", label: "-60%" },
          { value: "-0.666667", label: "-66.66667%" },
          { value: "-0.7", label: "-70%" },
          { value: "-0.75", label: "-75%" },
          { value: "-0.8", label: "-80%" },
          { value: "-0.833333", label: "-83.33333%" },
        ]}
          />
          </div>
      </div>
    </div>
  );
}

export default ChoiceField;


/*

*/