import React, {useState, useEffect} from 'react'
import SVG from "react-inlinesvg";
import {toAbsoluteUrl} from "../../_metronic/_helpers";

const StopHistory = (props)=> {

    let {stopData} = props;
    return (
        (stopData.length > 0) ? 
        <>
        {stopData.map((element)=> (
            <div className='flex-display'>
            <div className='vehicleStatusSvg'>
            <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Vehicle/stoppedVehicle.svg"
                    )}
                  />
                </span>
            </div>
            <div>
                <div className='stoppedStatusAndTime'>
                    <p style={{"color": "rgba(226, 71, 63, 1)", "fontSize": "1.25rem", "fontWeight": "600"}}>Stopped</p>
                    <p style={{"color": "rgba(120, 117, 117, 1)", "paddingInline": "1rem", "paddingTop":"0.25rem", "fontSize": "0.85rem", "fontWeight": "200"}}>{element.idleTime}</p>
                </div>
                <div className='add-detials'>
                    <p style={{"color": "rgba(120, 117, 117, 1)", "fontSize": "1rem"}}>{element.address}</p>
                    <p style={{"color": "rgba(120, 117, 117, 1)", "fontSize": "1rem"}}>{`Today ${element.startTimeStamp.split(", ")[1]} to ${element.endTimeStamp.split(", ")[1]}`}</p>
                </div>
            </div>
        </div>
        ))}
        </>
         : (<p>No route history found</p>)
        
    )
}

export default StopHistory