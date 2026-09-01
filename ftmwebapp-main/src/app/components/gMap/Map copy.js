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
  TrafficLayer
} from "react-google-maps";
import SocketIOComponent from '../../components/SocketIOComponent';

class Map extends React.Component {
  state = {
    progress: [],
    directions: null,
    markerPosition: {
      lat: this.props.locationData[this.props.locationData.length - 1].lat,
      lng: this.props.locationData[this.props.locationData.length - 1].lng,
      timeStamp: this.props.locationData[this.props.locationData.length - 1].timeStamp,
      fuel: this.props.locationData[this.props.locationData.length - 1].fuel ? this.props.locationData[this.props.locationData.length - 1].fuel: ''
    },
    openInfoWindow: false,
    currentLocation: {
      lat: "",
      lng: "",
      timeStamp: "",
      fuel: ""
    },
  };

  path = this.props.locationData;
  stopLocations = [
    { lat: this.path[this.path.length - 30].lat, lng: this.path[this.path.length - 30].lng },
    { lat: this.path[this.path.length - 50].lat, lng: this.path[this.path.length - 50].lng },
  ];

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
          this.path[0].lat,
          this.path[0].lng
        ),
        destination: new window.google.maps.LatLng(
          this.path[this.path.length - 1].lat,
          this.path[this.path.length - 1].lng
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
    console.log("currentLoc", currentLoc);
    let temp = { ...this.state.currentLocation };
    temp.lat = currentLoc.lat ? currentLoc.lat : '';
    temp.lng = currentLoc.lng ? currentLoc.lng : '';
    temp.timeStamp = currentLoc.timeStamp ? currentLoc.timeStamp : '';
    temp.fuel = currentLoc.fuel ? currentLoc.fuel : ''
    this.setState({
      openInfoWindow: !this.state.openInfoWindow,
      currentLocation: temp,
    });
    // const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${currentLoc.lat},${currentLoc.lng}&key=${config.mapsKey}`;
    // axios
    // .get(geocodingUrl)
    // .then((response) => {
    //   if (response.data.status === 'OK') {
    //     const address = response.data.results[0].formatted_address;
    //     console.log('Address:', address);
    //   } else {
    //     console.error('Geocoding request failed:', response.data.status);
    //   }
    // })
    // .catch((error) => {
    //   console.error('Error making the geocoding request:', error);
    // });
  };

  // Listen new lat, long from device realtime and move object when get new data
  handleEvent = (data) => {
    let updateLoc = [...this.state.progress, data];
    this.setState({
      progress: updateLoc
    })
  };

  render = () => {
    return (
      <>
        <GoogleMap
          defaultZoom={16}
          defaultCenter={{ lat: 17.7005649, lng: 78.4830016 }}
        >
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
                    lat: stop.lat,
                    lng: stop.lng
                  }}
                  title={index}
                  label={`${index + 1}`}
                />
              ))}
              <Marker
                position={this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1] : this.state.markerPosition}
                onClick={() =>
                  this.handleMarkerClick(this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1]: this.state.markerPosition)
                }
                icon={{
                  url: require('../../utils/icons/truck-icon.png'),
                  scaledSize: {width: 36, height: 36},
                  scale: 7
                }}
              >
                {this.state.openInfoWindow && (
                  <InfoWindow
                    onCloseClick={() =>
                      this.handleMarkerClick(this.state.progress.length > 0 ? this.state.progress[this.state.progress.length - 1]: this.state.markerPosition)
                    }
                  >
                    <div>
                      <div className="d-flex flex-column">
                        <div className="d-flex flex-column">
                            <p className="font-weight-bold mb-0">Latest data</p>
                            {this.state.currentLocation.timeStamp ? (
                              <p>
                                {this.state.currentLocation.timeStamp}
                              </p>
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="d-flex">
                            <div className="mr-5">
                              <p className="font-weight-bold mb-0">Latitude</p>
                              {this.state.currentLocation.lat ? (
                                <p>{this.state.currentLocation.lat} </p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div className="mr-5">
                              <p className="font-weight-bold mb-0">Longitude</p>
                              {this.state.currentLocation.lng ? (
                                <p>{this.state.currentLocation.lng}</p>
                              ) : (
                                ""
                              )}
                            </div>
                            <div>
                              <p className="font-weight-bold mb-0">Fuel</p>
                              {this.state.currentLocation.fuel ? (
                                <p>{`${this.state.currentLocation.fuel} L`}</p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
          <TrafficLayer autoUpdate />
        </GoogleMap>
        <SocketIOComponent
          endpoint="http://tsocket.fleetstakes.com:9004"
          event="GJ27TD6391"
          onEvent={this.handleEvent}
        />
      </>
    );
  };
}

const MapComponent = withScriptjs(withGoogleMap(Map));

export default MapComponent;
