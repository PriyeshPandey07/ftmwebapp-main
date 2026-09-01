import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import MapComponent from "../components/gMap/Map";
import config from "../components/gMap/config";
import { post } from "../components/api";

const LiveLocationTracking = () => {
  let [locationData, setLocationData] = useState([]);
  
  useEffect(()=> {
    const loadData = async () => {
      try {
        const response = await post("/location-tracking", {
          "vehicleNo": "GJ27TD6391",
          "duration": "today"
        });
        if (response.data.length > 0) {
          const locations = [];
          response.data.forEach((loc, i) => {
            let locData = {
              lat: loc.coordinates[0],
              lng: loc.coordinates[1],
              timeStamp: loc.timeStamp !== undefined ? moment(loc.timeStamp).format('DD-MM-YYYY HH:mm:ss') : moment().format('DD-MM-YYYY HH:mm:ss'),
              fuel: loc.fuel ? loc.fuel : ''
            }
            locations.push(locData);
          });
          setLocationData(locations);
        }
      } catch (error) {
        console.log(error);
      }
    };
   loadData();
  }, []);
  return(
    <>
      {locationData.length > 0 && <MapComponent
        googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.mapsKey}&v=3.exp&libraries=geometry,drawing,places1`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `600px`, width: "100%" }} />}
        mapElement={<div style={{ height: `100%` }} />}
        locationData={locationData}
      />}
    </>
  );
};

export default LiveLocationTracking;
