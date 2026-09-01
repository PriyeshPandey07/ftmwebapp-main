import React from "react";
import Select from "react-select";
const SelectInputComponent = ({
  data,
  isRequired,
  label,
  formikFunc,
  value,
  name,
  id,
  handleBlur,
  testFunc,
  className,
  selectOnchange,
}) => {
  return (
    <>
      <div className="mb-3">
        <Select
          style={{
            border: "0",
            outline: "none",
            width: "100%",
            boxShadow: "initial",
            borderRadius: "0.25rem",
            background: "white",
          }}
          className={`${className} react-select-box`}
          options={data}
          onChange={(e) => {
            if (name !== "deviceOption") {
              formikFunc.setFieldValue(name, e);
            }
            if (name !== "deviceName") {
              formikFunc.setFieldValue(name, e);
            }
            if (name === "state") {
              testFunc(e._id);
            }
            if (name === "reportType") {
              testFunc(e._id);
            }
            if (name === "deviceOption") {
              selectOnchange(e, "deviceOption");
            }
            if (name === "brandModel") {
              testFunc(e, "brandModel");
            }
          }}
          getOptionLabel={(option) => option.name}
          getOptionValue={(option) => option._id}
          onBlur={handleBlur}
          defaultValue={value}
          value={value}
          name={name}
          id={id}
        />
      </div>
    </>
  );
};

export default SelectInputComponent;
