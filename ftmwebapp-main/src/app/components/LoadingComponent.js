import React from "react";
import Spinner  from "react-bootstrap/Spinner";

const Loading = ()=> {
    return (
        <>
        <div style={{'display': "flex", "justifyContent": "center", "alignItems": "center", "height": "50vh"}}>
        <Spinner style={{"textAlign": "center"}} animation="border" variant="success" />
        </div>
        </>
    )
}

export default Loading;
