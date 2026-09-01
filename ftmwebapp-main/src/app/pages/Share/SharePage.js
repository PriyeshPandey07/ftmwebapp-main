import React, {useState, useEffect} from "react";
import MapComponent from "../../components/gMap/Map";
import { useParams } from "react-router-dom";
import { post } from "../../components/api";
import config from "../../components/gMap/config";
import moment from "moment";
import StopHistory from "../../components/StopHistory";
import Loading from "../../components/LoadingComponent";
import { SweetAlert } from "../../utils/helper";


const SharePage = ()=> {
    let {id} = useParams();
    let [location, setLocation] = useState([]);
    let [vehicleNo, setVehicleNo] = useState("");
    let [isLoading, setIsLoading] = useState(false);
    const [stopData, setStopData] = useState([]);
    const [isRouteHistoryVisible, setIsRouteHistoryVisible] = useState(false);

  // Function to toggle the Route History panel
  const toggleRouteHistory = () => {
    setIsRouteHistoryVisible(!isRouteHistoryVisible);
  };
    const fetchStopData = async (vehicleNo) => {
        try {
            const getData = await post("/get-stops", {vehicleNo: vehicleNo, timeFilter: "range", endDate: moment().endOf('day'), startDate: moment().startOf('day')});
            console.log('getdata ', getData.data)
            if (getData.data) {
                setStopData(getData.data);
            } else {
                setStopData([]);
            }

        } catch (error) {
            console.log('error', error);
            setStopData([]);
        }
    }
    const getVehicleDataByToken = async (id)=> {
        setIsLoading(true);
        const getVehicle = await post('/get-vehicle-detials', {token: id});
        if (getVehicle.status === 200) {
          let locationData = getVehicle.data.locationData;
          const locations = [];
          locationData.forEach((loc, i) => {
            let locData = {
              lat: loc.coordinates[0],
              lng: loc.coordinates[1],
              timeStamp: moment(loc.createdAt).format('DD-MM-YYYY HH:mm:ss'),
              fuel: loc.fuel ? loc.fuel : '',
              ignition: loc.ignition,
              speed: loc.speed,
              address: loc.address
            }
            locations.push(locData);
          });
          setLocation(locations);
          console.log('location ', locations)
          setVehicleNo(getVehicle.data.vehicleNo);
          await fetchStopData(getVehicle.data.vehicleNo);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          SweetAlert("Something went wrong in fetching data", true)
        }
    }

    useEffect(()=> {
        getVehicleDataByToken(id);
    },[])

    // if(width > 1000) {
    //   setIsRouteHistoryVisible(true)
    // }
   
    return (
      (isLoading ? (
        <>
        <div style={{"display": "flex", "alignItems": "center", "justifyContent": "center", "marginTop": "10rem"}}>
        <Loading/>
        </div>
        </>
      ):
        <>
        {location.length > 0 ? (
          <>
          {!isRouteHistoryVisible && (
        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '10px',
            width: '40px',
            height: '40px',
            backgroundColor: '#ffffff',
            border: '1px solid #ddd',
            borderRadius: '50%',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={toggleRouteHistory}
        >
          {/* <DeleteIcon style={{ color: '#007bff' }} /> */}
        </div>
      )}
          <div className="map-details-wrapper">
            {isRouteHistoryVisible && 
            <div id="kt_drawer_example_basic" className="share-details-wrapper bg-white" style={{ width: '350px' }}>
              <div style={{display : "flex" , justifyContent :"space-between"}}>
              <h2 style={{"paddingInline": "1rem", "paddingTop": "1rem"}}>Route History</h2>
              {/* <DeleteIcon style={{margin:"10px" , cursor:"pointer"}} onClick={toggleRouteHistory}/> */}
              </div>
              <StopHistory stopData={stopData}/>
            </div>}
            
            <div className="map-wrapper" style={{ flex: isRouteHistoryVisible ? 1 : '0 0 100%', height: '100vh' }}>
              <MapComponent
              googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.mapsKey}&v=3.exp&libraries=geometry,drawing,places1`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100vh`, width: "100%" }} />}
              mapElement={<div style={{ height: `100%` }} />}
              locationData={location}
              vehicleNo={vehicleNo}
              stopData={stopData}
              />
            </div>
          </div>
          </>
        ) : (<p>No location data found!</p>)}
      </>
      )
    )
}

export default SharePage;