import React, { useState, useRef, useEffect } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import Slider from "react-slick";
import { toAbsoluteUrl } from "../../../../_helpers";
import SVG from "react-inlinesvg";
import { post } from "../../../../../app/components/api";

const VehicleDetail = ({ vehicleData, list, index }) => {
  //const slider = useRef(null);
  const [vehicleDetails, setVehicleDetails] = useState({
    rcPhoto: vehicleData.RCPhoto,
    vehiclePhoto: vehicleData.vehiclePhoto,
    tripVehicleStatus: vehicleData.tripVehicleStatus,
    clientName: vehicleData?.clientData?.name
      ? vehicleData?.clientData?.name
      : "N/A",
    deviceName: vehicleData?.deviceData?.modelName
      ? vehicleData?.deviceData?.modelName
      : "N/A",
    imeiNumber: vehicleData?.deviceData?.ImeiNo
      ? vehicleData?.deviceData?.ImeiNo
      : "N/A",
    vehicleNo: vehicleData.vehicleNo,
    vehicleStatusCss: "",
    vehicleStatus: "",
    fuel: "",
    todayKm: "",
    totalKm: "",
    ignition: "",
    speed: "",
  });

  // const [arrIndex, setArrIndex] = useState(index);
  // const [isNextDisabled, setIsNextDisabled] = useState(false);
  // const [isPrevDisabled, setIsPrevDisabled] = useState(false);

  const [vehicleStatusCss, setVehicleStatusCss] = useState("");
  const [vehicleStatus, setVehicleStatus] = useState("");

  var settings = {
    dots: false,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const updateStatus = (status) => {
    switch (status) {
      case "moving":
        // setVehicleStatusCss("#0C8017");
        // setVehicleStatus("50 Km/hr")
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "50 Km/hr",
          vehicleStatusCss: "#0C8017",
        }));
        break;
      case "idle":
        // setVehicleStatus("IDLE");
        // setVehicleStatusCss("#F7D24F")
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "IDLE",
          vehicleStatusCss: "#F7D24F",
        }));
        break;
      case "stopped":
        // setVehicleStatus("STOPPED");
        // setVehicleStatusCss("#E2473F");
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "STOPPED",
          vehicleStatusCss: "#E2473F",
        }));
        break;
      case "offline":
        // setVehicleStatus("OFFLINE");
        // setVehicleStatusCss("#E2473F")
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "OFFLINE",
          vehicleStatusCss: "#E2473F",
        }));
        break;
      default:
        // setVehicleStatus("N/A");
        // setVehicleStatusCss("grey")
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "N/A",
          vehicleStatusCss: "grey",
        }));
        break;
    }
  };

  let fetchData = async (vehicleNo) => {
    console.log(2);
    let dataLocation = await post("/superadmin/vehicle-location", {
      vehicleNo: vehicleNo,
    });
    if (dataLocation.status == 200) {
      setVehicleDetails((prevState) => ({
        ...prevState,
        fuel: dataLocation.data.latestLocation.fuel,
        todayKm: dataLocation.data.todayKm,
        totalKm: dataLocation.data.latestLocation.distance,
        ignition:
          dataLocation.data.latestLocation.ignition === true ? "On" : "Off",
        speed: dataLocation.data.latestLocation.speed,
      }));
    } else {
      setVehicleDetails((prevState) => ({
        ...prevState,
        fuel: "N/A",
        todayKm: "N/A",
        totalKm: "N/A",
        ignition: "N/A",
        speed: "N/A",
      }));
    }
  };

  useEffect(() => {
    fetchData(vehicleData.vehicleNo);
    updateStatus(vehicleDetails.tripVehicleStatus);
    //slider.current.slickGoTo(index)
  }, []);

  // const updateNextState = async (index) => {
  //     let nextIndex = index;

  //     if (nextIndex > list.length - 1) {
  //         setArrIndex(list.length - 1);
  //         nextIndex = (list.length - 1);
  //         setIsNextDisabled(true);
  //         setIsPrevDisabled(false);
  //         return;
  //     } else {
  //         setArrIndex(nextIndex);
  //         setIsNextDisabled(false);
  //         setIsPrevDisabled(false)
  //     }

  //     console.log('arrIndex ', arrIndex)
  //     let data = list[index];
  //     await fetchData(data.vehicleNo)
  //     slider.current.slickNext()
  //     setVehicleDetails(prevData=> ( {
  //         ...prevData,
  //         rcPhoto: data?.RCPhoto ? data.RCPhoto : "",
  //     vehiclePhoto: data.vehiclePhoto,
  //     tripVehicleStatus: data.tripVehicleStatus,
  //     clientName: data?.clientData?.name ? data?.clientData?.name : "N/A",
  //     deviceName: data?.deviceData?.modelName ? data?.deviceData?.modelName : "N/A",
  //     imeiNumber: data?.deviceData?.ImeiNo ? data?.deviceData?.ImeiNo : "N/A",
  //     vehicleNo: data.vehicleNo
  // }))
  // updateStatus(data.tripVehicleStatus);
  // }

  // const updatePrevState = async (index) => {
  //     let prevIndex = index;

  //     if (index < 0) {
  //         setArrIndex(0);
  //         prevIndex = 0;
  //         setIsPrevDisabled(true);
  //         setIsNextDisabled(false);
  //         return;
  //     } else {
  //         setArrIndex(prevIndex)
  //         setIsPrevDisabled(false);
  //         setIsNextDisabled(false)
  //     }
  //     let data = list[prevIndex];
  //     await fetchData(data.vehicleNo)
  //     slider.current.slickPrev()
  //     setVehicleDetails(prevData=> ( {
  //         ...prevData,
  //         rcPhoto: data?.RCPhoto ? data.RCPhoto : "",
  //     vehiclePhoto: data.vehiclePhoto,
  //     tripVehicleStatus: data.tripVehicleStatus,
  //     clientName: data?.clientData?.name ? data?.clientData?.name : "N/A",
  //     deviceName: data?.deviceData?.modelName ? data?.deviceData?.modelName : "N/A",
  //     imeiNumber: data?.deviceData?.ImeiNo ? data?.deviceData?.ImeiNo : "N/A",
  //     vehicleNo: data.vehicleNo
  // }))
  //     updateStatus(data.tripVehicleStatus);
  // }

  return (
    <>
      <div className="vehicle-container">
        <div className="vehicleDetailsHeader">
          <div className="vehicleCard">
            <div className="iconWrapper">
              <p className="iconKeyValue">OFF</p>
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Vehicle/ignition.svg")}
              />
            </div>
            <div className="keyValue">
              <p>Ignition Status</p>
            </div>
          </div>
          <div className="vehicleCard">
            <div className="iconWrapper">
              <p className="iconKeyValue">1400</p>
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Vehicle/todayKm.svg")}
              />
            </div>
            <div className="keyValue">
              <p>Today'S KM</p>
            </div>
          </div>
          <div className="vehicleCard">
            <div className="iconWrapper">
              <p className="iconKeyValue">120 km/h</p>
              <SVG
                src={toAbsoluteUrl("/media/svg/icons/Vehicle/currentSpeed.svg")}
              />
            </div>
            <div className="keyValue">
              <p>Current Speed</p>
            </div>
          </div>
          <div className="vehicleCard">
            <div className="iconWrapper">
              <p className="iconKeyValue">10 ltr</p>
              <SVG src={toAbsoluteUrl("/media/svg/icons/Vehicle/fuel.svg")} />
            </div>
            <div className="keyValue">
              <p>Fuel Level</p>
            </div>
          </div>
          <div className="vehicleCard">
            <div className="iconWrapper">
              <p className="iconKeyValue">3.609</p>
              <SVG src={toAbsoluteUrl("/media/svg/icons/Vehicle/fuel.svg")} />
            </div>
            <div className="keyValue">
              <p>Mileage</p>
            </div>
          </div>
        </div>
        {/* <div className='vehicle-status-details' style={{'background':`${vehicleDetails.vehicleStatusCss}`}}>
                <p style={{'marginBottom':"0", "fontSize":"1.25rem", "fontWeight":"600"}}>{vehicleDetails.vehicleStatus}</p>
            </div>
            <div className='vehicle-number-map'>
                <p className='vehicle_number' style={{"fontSize":"1.25rem"}}>{vehicleDetails.vehicleNo}</p>
                <a className='map_details' href='/dashboard'>Map View</a>
            </div>
            <div className='image-wrapper'>
                <Slider {...settings} ref={slider} className='slider-wrapper'>
                    {list.map((element)=> (
                        <div>
                        <img src={`${process.env.REACT_APP_PUBLIC_URL + element.vehiclePhoto}`} width="200px" height="100px"/>
                        </div>
                    ))}
                    
                </Slider>
                <div className='slider_btns'>
                    <button style={{'border': "none", "background": 'transparent', "position": "relative", "bottom":"5rem", "left": "0rem"}} disabled={isPrevDisabled}><SVG onClick={() => updatePrevState(arrIndex - 1, false)} src={toAbsoluteUrl(
                      "/media/svg/icons/General/LeftArrow.svg"
                    )} /> </button>

                    <button style={{'border': "none", "background": 'transparent', "position": "relative", "bottom":"5rem", "left": "26rem"}} disabled={isNextDisabled}>
                    <SVG onClick={() => updateNextState(arrIndex + 1, true)} src={toAbsoluteUrl(
                        "/media/svg/icons/General/RightArrow.svg"
                        )} />
                        </button>
                </div>
            </div>
            <hr style={{'color':"#7A7A7A", "boxShadow": "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"}}/>
            <div className='vehicle_details_wrapper'>
                <div className='vehicle_detail'>
                    <SVG src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/fuel.svg"
                        )} />
                    <div className='details'> 
                        <p className='details_key'>Fuel Level</p>
                        <p className='details_value'>{vehicleDetails.fuel} LTR</p>
                    </div>
                    <SVG src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/ignition.svg"
                        )} />
                    <div className='details'> 
                    <p className='details_key'>Ignition</p>
                        <p className='details_value'>{vehicleDetails.ignition}</p>
                    </div>
                    <SVG src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/todayKm.svg"
                        )} />
                    <div className='details'> 
                    <p className='details_key'>Today's KM</p>
                        <p className='details_value'>{vehicleDetails.todayKm} KM</p>
                    </div>
                    <SVG src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/currentSpeed.svg"
                        )} />
                    <div className='details'> 
                    <p className='details_key'>Current Speed</p>
                        <p className='details_value'>{vehicleDetails.speed} km/hr</p>
                    </div>
                    <SVG src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/totalKm.svg"
                        )} />
                    <div className='details'> 
                    <p className='details_key'>Total KM</p>
                        <p className='details_value'>{vehicleDetails.totalKm} KM</p>
                    </div>
                </div>
            </div>
            <div className='other_details_wrapper'>
                <p className='other_details'>Client name: {vehicleDetails.clientName} </p>
                <p className='other_details'>Device name: {vehicleDetails.deviceName} </p>
                <p className='other_details'>Imei No: {vehicleDetails.imeiNumber} </p>
                <p className='other_details' style={{'fontSize': "0.75rem", "paddingTop": "1rem"}}>B Block, World Trade Tower, 412/A, Sarkhej - Gandhinagar
                    Hwy, Makarba, Ahmedabad, Gujarat 380051</p>
            </div>
            <div className='important_documents_wrapper'>
                <p style={{"fontWeight": "600"}}>Important documents</p>
                <img style={{"borderRadius":"0.75rem"}} src={process.env.REACT_APP_PUBLIC_URL + vehicleDetails.rcPhoto} width="200px" height="100px"/>
            </div> */}
      </div>
    </>
  );
};

export default VehicleDetail;
