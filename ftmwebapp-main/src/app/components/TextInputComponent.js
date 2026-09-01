import React from "react";

const TextInputComponent = ({label, placeholder, inputType, isRequired,value, onChange,handleBlur,name,errorMsg, isDisabled, max=undefined, className}) => {
    let classes = isRequired ? "required set_label_font" : "set_label_font";
    return (
        <>
        <div className="mb-3">
            {label && <span style={{'display':"block",  "fontWeight":"500", "paddingBlock":"0.25rem"}} className={classes}>{label}</span>}
            <input
                type={inputType}
                placeholder={placeholder}
                style={{"border": "0","outline": "none", "width": "100%", "boxShadow": "initial", "borderRadius": "0.25rem", "paddingInline": "0.7rem 0.7rem", "paddingBlock": "0.7rem 0.7rem","background":"white"}}
                required={isRequired}
                className={className ? className : "set_placeholder_font"}
                onChange={onChange}
                value={value}
                onBlur={handleBlur}
                name={name}
                disabled={isDisabled}
                max={max}
                />
                {errorMsg ? <span style={{"color":"red", "paddingTop":"0.25rem"}} className="text-center">{errorMsg}</span> : null}
        </div>
        </>
    )
}

export default TextInputComponent;