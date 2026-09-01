import React from 'react'

const ButtonComponent = ({placeholder, handleClick, isDisabled, type='button'}) => {
    const btnClasses = isDisabled ? "disabled set_placeholder_font" : "set_placeholer_font"
    return (
        <>
        <div style={{"marginBlock":"1.25rem", "display": "flex", "flexDirection": "column", "justifyContent": "end", "alignItems": "end"}}>    
        <span style={{'display':"block",  "fontWeight":"500", "paddingBlock":"0.25rem", "paddingTop": "2rem"}}></span>        
        <button
                type={type}
                style={{"border": "0","outline": "none", "width": "150px", "boxShadow": "initial", "borderRadius": "0.25rem", "paddingInline": "0.7rem 0.7rem", "paddingBlock": "0.7rem 0.7rem", "background":"linear-gradient(rgba(116, 200, 194, 1), rgba(59, 113, 109, 1))", "fontWeight":"500", "color": "white"}}
                onClick={handleClick}
                className={btnClasses}
                disabled={isDisabled}>
                    {placeholder}
                </button>
        </div>
        </>
    )
}

export default ButtonComponent;