import Select from "react-select";
import React from "react";

const customStyle = {
  control: (base) => ({
    ...base,
    "&:hover": { borderColor: "#B5B5C3" }, // border style on hover
    border: "1px solid #E4E6EF", // default border color
    boxShadow: "none", // no box-shadow
    cursor: "pointer",
  }),
  dropdownIndicator: (base, data) =>
    data.isFocused
      ? {
          ...base,
          svg: {
            transform: "rotateX(150deg)",
          },
        }
      : {
          ...base,
        },
};

const ReactSelect = ({
  value,
  label,
  handleOnChange,
  isSearchable,
  options,
  name,
  isLoading,
  loadingMessage,
  noOptionsMessage,
  placeholder,
  selectInputRef,
  multiple,
  classNamePrefix,
  id,
  isClearable = true,
  setFieldValue,
}) => {
  return (
    <Select
      isMulti={multiple && multiple !== undefined ? true : false}
      ref={selectInputRef ? selectInputRef : null}
      styles={customStyle}
      value={value}
      placeholder={placeholder}
      onChange={(selectedOption) => {
        console.log('selected Option ', selectedOption)
        if (selectedOption !== null && name === "state") {
          handleOnChange(name, selectedOption);
        } else if (selectedOption !== null && name === "city") {
          handleOnChange(name, selectedOption);
        } else if (selectedOption !== null && name === "status") {
          handleOnChange(name, selectedOption)
        } else {
          handleOnChange(name, null);
        }
      }}
      isSearchable={isSearchable}
      getOptionLabel={(option) => option.name}
      getOptionValue={(option) => option._id}
      options={options}
      name={name}
      isLoading={isLoading}
      loadingMessage={() => loadingMessage}
      noOptionsMessage={() => noOptionsMessage}
      isClearable={value !== null}
      classNamePrefix={classNamePrefix}
      id={id}
      valueType={"string"}
    />
  );
};

export { ReactSelect, customStyle };
