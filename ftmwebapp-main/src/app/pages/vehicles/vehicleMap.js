import React, { useEffect, useState } from "react";
//import { useSearchParams } from 'react-router-dom';
import { useParams } from "react-router-dom";
import config from "../../components/gMap/config";
import MapComponent from "../../components/gMap/Map";
import { post } from "../../components/api";

const VehicleMap = ({ history }) => {
  const params = new URLSearchParams(window.location.href);
  const { id } = useParams();
  const [locationData, setLocationData] = useState([]);
  let getSearchParams = (searchStr) => {
    let split = searchStr.split("?");

    const cleanedArray = split.filter((subArray) => subArray.length > 0);

    let finalArray = [];
    for (let element of cleanedArray) {
      let coordinate = element.split("=");
      finalArray.push(parseFloat(coordinate[1]));
    }

    setLocationData([{ lat: finalArray[0], long: finalArray[1] }]);
  };

  let fetchVehicleLocation = async (id) => {
    let fetch = await post("/superadmin/get-latest-location", {
      vehicleNo: id,
    });
    console.log("fetch ", fetch);

    if (fetch.status == 201) {
      let data = fetch.data;
      let updatedData = [];
      if (data.length > 0) {
        for (let result of data) {
          let newObj = { ...result };
          newObj.lat = parseFloat(result.coordinates[0]);
          newObj.lng = parseFloat(result.coordinates[1]);
          updatedData.push(newObj);
        }
      }
      console.log("updated Data  ", updatedData);
      setLocationData(updatedData);
    } else {
      setLocationData([]);
    }
  };

  useEffect(() => {
    getSearchParams(window.location.search);
    console.log("we aer in use effecr");
    fetchVehicleLocation(id);
  }, []);

  return (
    <>
      {locationData.length > 0 && (
        <MapComponent
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${config.mapsKey}&v=3.exp&libraries=geometry,drawing,places1`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh`, width: "100%" }} />}
          mapElement={<div style={{ height: `100%` }} />}
          locationData={locationData}
          vehicleNo={id}
          stopData={[]}
        />
      )}
    </>
  );
};

export default VehicleMap;
