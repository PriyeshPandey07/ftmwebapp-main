import React from "react";

const SelectFileComponent = ({label, placeholder, isRequired,acceptType,formikFunc,name,errorMsg, handleBlur, className }) => {
    return (
        <>
        <div className="mb-3">
            <label htmlFor="files">{placeholder}</label>
            <input
                type="file"
                placeholder={placeholder}
                required={isRequired}
                className={className}
                onChange={(e) =>
                    formikFunc.setFieldValue(name, e.currentTarget.files[0])
                  }
                name={name}
                onBlur={handleBlur(name)}
                accept={acceptType}
            />
        </div>
        </>
    )
}

export default SelectFileComponent;