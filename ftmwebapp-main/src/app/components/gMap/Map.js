import React from "react";
// import axios from 'axios';
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  DirectionsRenderer,
  Polyline,
  Marker,
  InfoWindow,
  // TrafficLayer
} from "react-google-maps";
import SocketIOComponent from '../../components/SocketIOComponent';
import { toAbsoluteUrl } from "../../../_metronic/_helpers";

class Map extends React.Component {
  state = {
    progress: [],
    directions: null,
    markerPosition: {
      lat: this.props.locationData[this.props.locationData.length - 1].lat,
      lng: this.props.locationData[this.props.locationData.length - 1].lng,
      timeStamp: this.props.locationData[this.props.locationData.length - 1].timeStamp,
      fuel: this.props.locationData[this.props.locationData.length - 1].fuel ? this.props.locationData[this.props.locationData.length - 1].fuel: '',
      ignition: this.props.locationData[this.props.locationData.length - 1].ignition,
      speed: this.props.locationData[this.props.locationData.length - 1].speed,
      address: this.props.locationData[this.props.locationData.length - 1].address
    },
    openInfoWindow: false,
    openStopsWindow: '',
    currentLocation: {
      address: "",
      speed: "",
    },
  };

  path = this.props.locationData;
  stopLocations = this.props.stopData
  vehicleNo = this.props.vehicleNo;

  velocity = 100;
  initialDate = new Date();

  getDistance = () => {
    // seconds between when the component loaded and now
    const differentInTime = (new Date() - this.initialDate) / 1000; // pass to seconds
    return differentInTime * this.velocity; // d = v*t -- thanks Newton!
  };

  componentDidMount = () => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: new window.google.maps.LatLng(
          this.path[this.path.length - 1].lat,
          this.path[this.path.length - 1].lng
        ),
        destination: new window.google.maps.LatLng(
          this.path[0].lat,
          this.path[0].lng
        ),
        travelMode: "DRIVING",
      },
      (result, status) => {
        if (status === "OK") {
          this.setState({ directions: result });
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
    //this.interval = window.setInterval(this.moveObject, 5000);
  };

  componentWillUnmount = () => {
    //window.clearInterval(this.interval);
  };

  componentWillMount = () => {
    this.updatePath(this.props.locationData);
  };

  updatePath = (locationData) => {
    this.path = locationData.map((coordinates, i, array) => {
      if (i === 0) {
        return { ...coordinates, distance: 0 }; // it begins here!
      }
      const { lat: lat1, lng: lng1 } = coordinates;
      const latLong1 = new window.google.maps.LatLng(lat1, lng1);

      const { lat: lat2, lng: lng2 } = array[0];
      const latLong2 = new window.google.maps.LatLng(lat2, lng2);

      // in meters:
      const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
        latLong1,
        latLong2
      );
      return { ...coordinates, distance };
    });
  };

  // open info window
  handleMarkerClick = (currentLoc) => {
    let temp = { ...this.state.currentLocation };
    temp.speed = currentLoc.speed ? currentLoc.speed : "0"
    temp.address = currentLoc.address;
    this.setState({
      openStopsWindow: '',
      openInfoWindow: !this.state.openInfoWindow,
      currentLocation: temp,
    });
  };

  handleStopsMarkerClick = (index) => {
    this.setState({
      openInfoWindow: false,
      openStopsWindow: index
    });
  };

  // Listen new lat, long from device realtime and move object when get new data
  handleEvent = (data) => {
    let updateLoc = [...this.state.progress, data];
    console.log('updateLoc', updateLoc);
    this.setState({
      progress: updateLoc
    })
  };

  render = () => {
    let vehicleStatus = '';
    if (this.state.progress.length > 0) {
      if (this.state.progress[this.state.progress.length - 1].speed == 0 && this.state.progress[this.state.progress.length - 1].ignition == true) {
        vehicleStatus = 'idle';
      } else if (this.state.progress[this.state.progress.length - 1].speed > 0 && this.state.progress[this.state.progress.length - 1].ignition == true) {
        vehicleStatus = 'running';
      } else {
        vehicleStatus = 'stopped';
      }
    } else {
      if (this.props.locationData !== undefined && this.props.locationData[this.props.locationData.length - 1].speed == 0 && this.props.locationData[this.props.locationData.length - 1].ignition == true) {
        vehicleStatus = 'idle';
      } else if (this.props.locationData !== undefined && this.props.locationData[this.props.locationData.length - 1].speed > 0 && this.props.locationData[this.props.locationData.length - 1].ignition == true) {
        vehicleStatus = 'running';
      } else {
        vehicleStatus = 'stopped';
      }
    }

    console.log("---", this.state.currentLocation);
    return (
      <>
        <GoogleMap
          defaultZoom={16}
          defaultCenter={{ lat: this.path[this.path.length - 1].lat, lng: this.path[this.path.length - 1].lng }}
          options={{
            fullscreenControl: false, // Disable the fullscreen control
          }}
        >
          {/* <TrafficLayer autoUpdate /> */}
          {this.state.progress && (
            <>
              <Polyline
                path={this.state.progress}
                options={{ strokeColor: "#0044ff", strokeWeight: 2 }}
              />
              <DirectionsRenderer
                directions={this.state.directions}
                options={{
                  polylineOptions: {
                    strokeOpacity: 2,
                    strokeColor: '#0044ff',
                  },
                  suppressMarkers: true, // Remove markers for point A and point B
                }}
              />
              {this.stopLocations.map((stop, index) => (
               <Marker
                  key={index}
                  position={{
                    lat: stop.coordinates[0],
                    lng: stop.coordinates[1]
                  }}
                  title={index}
                  label={{
                    text: `${index+1}`,
                    color: "white"
                  }}
                  icon={{
                    url:toAbsoluteUrl("/media/svg/icons/Vehicle/stoppedHistory.svg"),
                    scaledSize: {width: 36, height: 36},
                    scale: 7
                  }}
                  onClick={() =>
                    this.handleStopsMarkerClick(index)
                  }
                >
                  {this.state.openStopsWindow}
                  {index}
                   {this.state.openStopsWindow !== '' && this.state.openStopsWindow == index && (
                    <InfoWindow
                      onCloseClick={() =>
                        this.handleStopsMarkerClick('')
                      }
                    >
                      <div style={{ color: '#fff', width: '280px' }} className="stops">
                        <p>{stop.idleTime}</p>
                        <p>{stop.startTimeStamp} - {stop.endTimeStamp}</p>
                        <p>{stop.address}</p>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              ))}
              <Marker
                position={this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1] : this.state.markerPosition}
                onClick={() =>
                  this.handleMarkerClick(this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1]: this.state.markerPosition)
                }
                icon={{
                  url: require(`../../utils/icons/${vehicleStatus}_vehicle.png`),
                  scaledSize: {width: 50, height: 50},
                  scale: 7
                }}
              >
                {this.state.openInfoWindow && (
                  <InfoWindow
                    onCloseClick={() =>
                      this.handleMarkerClick(this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1]: this.state.markerPosition)
                    }
                  >
                    <div style={{ color: '#fff', width: '280px', display: 'flex', padding: '5px' }} className="live">
                      <p className="live-speed">{this.state.currentLocation.speed}</p>
                      <p>{this.state.currentLocation.address}</p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
        </GoogleMap>
        <SocketIOComponent
          endpoint="http://tsocket.fleetstakes.com:9004"
          event={this.vehicleNo}
          onEvent={this.handleEvent}
        />
      </>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default MapComponent;
