import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { ListGroup } from "react-bootstrap";
import { post } from "../../components/api";
import { SweetAlert } from "../../utils/helper";
import { getImageSize } from "react-image-size";
import Loading from "../../components/LoadingComponent";
import { useParams } from "react-router-dom";
import moment from "moment";

const VehicleDetails = ({ history }) => {
  let { id } = useParams();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showVehicleRCModal, setShowVehicleRCModal] = useState(false);
  const [showVehicleDocumentModal, setShowVehicleDocumentModal] = useState(
    false
  );
  const [isIgnitionOn, setIsIgnitionOn] = useState(false);
  const [rcPhotoSize, setRcPhotoSize] = useState();
  const [vehicleDocSize, setVehicleDocSize] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({
    RcPhoto: "",
    vehiclePhoto: "",
    tripVehicleStatus: "",
    vehicleNo: "",
    vehicleStatusCss: "",
    vehicleStatus: "",
    fuel: "",
    todayKm: "",
    totalKm: "",
    ignition: "",
    speed: "",
    address: "",
    mileage: "",
    coordinates: "",
  });

  const [data, setData] = useState({});

  const handleDownloadVehicleDocument = async (imageLink) => {
    var link = document.createElement("a");
    link.href = `${imageLink}`;
    link.download = `${imageLink}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    SweetAlert("Vehicle Document downloaded successfully", false);
  };

  const getImageDimentions = async (imageLink, docType) => {
    const dimensions = await getImageSize(imageLink);

    let sizeInKb;
    if (dimensions.width !== 0 && dimensions.height !== 0) {
      sizeInKb = parseInt((dimensions.width * dimensions.height) / 8 / 1024);
    } else {
      sizeInKb = 0;
    }

    if (docType == "RcPhoto") {
      if (sizeInKb > 0) {
        setRcPhotoSize(`${sizeInKb} kb`);
      } else {
        setRcPhotoSize("0 kb");
      }
    }
    if (docType == "vehicleDoc") {
      if (sizeInKb > 0 || sizeInKb == undefined) {
        setVehicleDocSize(`${sizeInKb} kb`);
      } else {
        setVehicleDocSize(`0 kb`);
      }
    }
  };

  const updateStatus = (status) => {
    switch (status) {
      case "moving":
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "Moving",
          vehicleStatusCss: "#0C8017",
        }));
        break;
      case "idle":
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "IDLE",
          vehicleStatusCss: "#F7D24F",
        }));
        break;
      case "stopped":
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "STOPPED",
          vehicleStatusCss: "#E2473F",
        }));
        break;
      case "offline":
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "OFFLINE",
          vehicleStatusCss: "#E2473F",
        }));
        break;
      default:
        setVehicleDetails((prevData) => ({
          ...prevData,
          vehicleStatus: "N/A",
          vehicleStatusCss: "grey",
        }));
        break;
    }
  };

  const updateIgnition = (ignitionStatus) => {
    setIsIgnitionOn(ignitionStatus);
  };

  let fetchData = async () => {
    setIsLoading(true);
    let dataLocation = await post("/superadmin/vehicle-location", {
      vehicleNo: id,
    });
    let vehicleData = await post("/superadmin/findVehicleByNo", {
      vehicleNo: id,
    });
    let vehicle = vehicleData.data[0];

    if (dataLocation.status == 200 && vehicleData.status == 200) {
      setData(vehicleData.data[0]);
      setVehicleDetails((prevState) => ({
        ...prevState,
        address: vehicle.address,
        vehicleNo: vehicle.vehicleNo,
        fuel: dataLocation.data.latestLocation.fuel,
        todayKm: dataLocation.data.todayKm,
        totalKm: dataLocation.data.latestLocation.distance,
        ignition:
          dataLocation.data.latestLocation.ignition === true ? "On" : "Off",
        speed: dataLocation.data.latestLocation.speed,
        mileage: dataLocation.data.todayMileage,
        RcPhoto: vehicle.RCPhoto,
        coordinates: dataLocation.data.latestLocation.coordinates,
        name: vehicle.client.name,
        lastRecord: dataLocation.data.latestLocation.timeStamp,
      }));
      await updateIgnition(dataLocation.data.latestLocation.ignition);
      await updateStatus(vehicle.tripVehicleStatus);
      await getImageDimentions(vehicle.RCPhoto, "RcPhoto");
      await getImageDimentions(vehicle.vehiclePhoto, "vehicleDoc");
    } else {
      setVehicleDetails((prevState) => ({
        ...prevState,
        fuel: "N/A",
        todayKm: "N/A",
        totalKm: "N/A",
        ignition: "N/A",
        speed: "N/A",
        mileage: "N/A",
      }));
    }
  };

  useEffect(() => {
    fetchData();
    setIsLoading(false);
    // updateStatus(vehicleDetails.tripVehicleStatus);
    //slider.current.slickGoTo(index)
  }, []);

  const handleAddressModal = (isOpen) => {
    setShowAddressModal(isOpen);
  };
  const handleVehicleRCModal = (isOpen) => {
    setShowVehicleRCModal(isOpen);
  };
  const handleVehicleDocumentModal = (isOpen) => {
    setShowVehicleDocumentModal(isOpen);
  };
  return (
    <>
      <div className="container">
        {!isLoading ? (
          <>
            {showAddressModal ? (
              <>
                <Modal
                  show={showAddressModal}
                  onHide={() => handleAddressModal(false)}
                  backdrop="static"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Vehicle Current Address</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <span style={{ fontWeight: "600" }}>
                          Vehicle Address{" "}
                        </span>{" "}
                        : {vehicleDetails.address}
                      </ListGroup.Item>
                    </ListGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleAddressModal(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : null}
            {showVehicleRCModal ? (
              <>
                <Modal
                  show={showVehicleRCModal}
                  onHide={() => handleVehicleRCModal(false)}
                  backdrop="static"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Vehile RC Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={vehicleDetails.RcPhoto}
                        width={"auto"}
                        height={"300"}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleVehicleRCModal(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : null}
            {showVehicleDocumentModal ? (
              <>
                <Modal
                  show={showVehicleDocumentModal}
                  onHide={() => handleVehicleDocumentModal(false)}
                  backdrop="static"
                >
                  <Modal.Header closeButton>
                    <Modal.Title>Vehicle Document Preview</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={vehicleDetails.vehiclePhoto}
                        alt="No Image Found"
                        width={"auto"}
                        height={"300"}
                      />
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => handleVehicleDocumentModal(false)}
                    >
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
              </>
            ) : null}
            <div className="vehicleDetailsHeader">
              <div className="vehicleCard">
                <div className="iconWrapper">
                  <p className="iconKeyValue">{vehicleDetails.ignition}</p>
                  <div style={{ marginRight: "0.25rem" }}>
                    {!isIgnitionOn ? (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Vehicle/ignition.svg"
                        )}
                      />
                    ) : (
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Vehicle/ignitionOn.svg"
                        )}
                      />
                    )}
                  </div>
                </div>
                <div className="keyWrapper">
                  <p className="keyName">Ignition Status</p>
                </div>
              </div>
              <div className="vehicleCard">
                <div className="iconWrapper">
                  <p className="iconKeyValue">{vehicleDetails.todayKm} KM</p>
                  <div style={{ marginRight: "0.25rem" }}>
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/todayKm.svg"
                      )}
                    />
                  </div>
                </div>
                <div className="keyWrapper">
                  <p className="keyName">Today KM's</p>
                </div>
              </div>
              <div className="vehicleCard">
                <div className="iconWrapper">
                  <p className="iconKeyValue">{vehicleDetails.speed} Km/Hr</p>
                  <div style={{ marginRight: "0.25rem" }}>
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/currentSpeed.svg"
                      )}
                    />
                  </div>
                </div>
                <div className="keyWrapper">
                  <p className="keyName">Current Speed</p>
                </div>
              </div>
              <div className="vehicleCard">
                <div className="iconWrapper">
                  <p className="iconKeyValue">{vehicleDetails.fuel} Ltrs</p>
                  <div style={{ marginRight: "0.25rem" }}>
                    <SVG
                      src={toAbsoluteUrl("/media/svg/icons/Vehicle/fuel.svg")}
                    />
                  </div>
                </div>
                <div className="keyWrapper">
                  <p className="keyName">Fuel Level</p>
                </div>
              </div>
              <div className="vehicleCard">
                <div className="iconWrapper">
                  <p className="iconKeyValue">{vehicleDetails.mileage}</p>
                  <div style={{ marginRight: "0.25rem" }}>
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Vehicle/mileage.svg"
                      )}
                    />
                  </div>
                </div>
                <div className="keyWrapper">
                  <p className="keyName">Mileage</p>
                </div>
              </div>
            </div>

            <div className="vehicleDetails">
              <div className="vehicleDetailsWrapper">
                <div className="vehicleList">
                  <ListGroup>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Owner Name:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.client?.ownerName || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Company Name:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.client?.name || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Mobile No:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.client?.mobileNo || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Email:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.client?.email || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Address:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.client?.address || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Client On Board:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {moment(data?.client?.createdAt).format(
                            "DD/MM/YYYY"
                          ) || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Device Name:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.deviceName || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Is Fuel:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.isFuel ? "Yes" : "No" || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Tyres:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data.tyreModel || "-"}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Engine No:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data.engineOn ? "Yes" : "No" || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Is Low Network:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data.isLowNetwork ? "Yes" : "No" || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          How Many Time Renew:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.subscription?.length || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Expired At:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.subscription
                            ? moment(
                                data?.subscription[
                                  data?.subscription?.length - 1 || 0
                                ].endDate
                              ).format("DD/MM/YYYY")
                            : "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Imei No:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.device?.ImeiNo || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Device Model Name:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {data?.device?.modelName || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Company Address:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                            width: "55%",
                          }}
                        >
                          {data?.client?.companyAddress || "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="listFontStyle">
                      <div className="listStyleWrapper">
                        <p style={{ marginBottom: "0px", fontSize: "1rem" }}>
                          Last Record Time:{" "}
                        </p>
                        <p
                          style={{
                            marginBottom: "0px",
                            fontSize: "0.9rem",
                            color: "black",
                            fontWeight: "600",
                          }}
                        >
                          {vehicleDetails?.lastRecord
                            ? moment(vehicleDetails?.lastRecord).format(
                                "DD/MM/YYYY HH:mm"
                              )
                            : "-"}{" "}
                        </p>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                </div>
                <div className="vehicleDocuments">
                  <span
                    className="newStatusLabel"
                    style={{ background: `${vehicleDetails.vehicleStatusCss}` }}
                  >
                    {`${vehicleDetails.vehicleStatus}`}
                  </span>
                  <div className="vehicleHeader">
                    <div className="vehicleHeaderWrapper">
                      <p
                        style={{
                          fontSize: "1.1rem",
                          color: "rgba(68, 68, 68, 1)",
                          fontWeight: "600",
                          marginBottom: "0px",
                        }}
                      >
                        {vehicleDetails.vehicleNo}
                      </p>
                      {/* <div className="viewMapBtn">
                        <a
                          onClick={() =>
                            history.push(`/map/${vehicleDetails.vehicleNo}`)
                          }
                          className="viewMapBtnStyle"
                        >
                          View Map
                        </a>
                      </div> */}
                    </div>
                    <div className="vehicleImage">
                      <SVG
                        src={toAbsoluteUrl(
                          "/media/svg/icons/Vehicle/vehicleImg.svg"
                        )}
                      />
                    </div>
                  </div>
                  <div className="vehicleAddressWrapper">
                    <div className="vehicleAddress">
                      <p
                        style={{
                          marginBlock: "0px",
                          color: "rgba(68, 68, 68, 1)",
                          fontSize: "1.1rem",
                          fontWeight: "500",
                        }}
                      >
                        Vehicle Address
                      </p>
                      <a onClick={() => handleAddressModal(true)}>
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/Eye.svg"
                          )}
                        />{" "}
                      </a>
                    </div>
                  </div>
                  <div className="vehicleImpDocuments">
                    <div className="vehicleImpDocHeader">
                      <p
                        style={{
                          color: "rgba(39, 37, 37, 1)",
                          marginBlock: "0px",
                          fontWeight: "700",
                          fontSize: "1.2rem",
                        }}
                      >
                        Important Documents
                      </p>
                    </div>
                    <div className="impDocumentsWrapper">
                      <div className="impDocumentsInternal">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/vehicleFile.svg"
                          )}
                        />
                        <div className="vehicleDocDetails">
                          <p
                            style={{
                              marginBlock: "0px",
                              color: "black",
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              paddingInline: "10px",
                            }}
                          >
                            Vehicle RC
                          </p>
                          <span>
                            {" "}
                            <span
                              style={{
                                marginBlock: "0px",
                                color: "grey",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                paddingInline: "10px",
                              }}
                            >
                              {rcPhotoSize}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="iconsWrapper">
                        <span>
                          <a onClick={() => handleVehicleRCModal(true)}>
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/General/Eye.svg"
                              )}
                            />{" "}
                          </a>
                        </span>
                        <span style={{ paddingLeft: "0.3rem" }}>
                          <a
                            onClick={() =>
                              handleDownloadVehicleDocument(
                                vehicleDetails.RcPhoto
                              )
                            }
                          >
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/General/vehicleDownload.svg"
                              )}
                            />
                          </a>
                        </span>
                      </div>
                    </div>
                    <div className="impDocumentsWrapper">
                      <div className="impDocumentsInternal">
                        <SVG
                          src={toAbsoluteUrl(
                            "/media/svg/icons/General/vehicleFile.svg"
                          )}
                        />
                        <div className="vehicleDocDetails">
                          <p
                            style={{
                              marginBlock: "0px",
                              color: "black",
                              fontSize: "1.1rem",
                              fontWeight: "500",
                              paddingInline: "10px",
                            }}
                          >
                            Vehicle Document
                          </p>
                          <span>
                            {" "}
                            <span
                              style={{
                                marginBlock: "0px",
                                color: "grey",
                                fontSize: "0.8rem",
                                fontWeight: "500",
                                paddingInline: "10px",
                              }}
                            >
                              {vehicleDocSize}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="iconsWrapper">
                        <span>
                          <a onClick={() => handleVehicleDocumentModal(true)}>
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/General/Eye.svg"
                              )}
                            />{" "}
                          </a>
                        </span>
                        <span style={{ paddingLeft: "0.3rem" }}>
                          <a
                            onClick={() =>
                              handleDownloadVehicleDocument(
                                vehicleDetails.vehiclePhoto
                              )
                            }
                          >
                            <SVG
                              src={toAbsoluteUrl(
                                "/media/svg/icons/General/vehicleDownload.svg"
                              )}
                            />
                          </a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    </>
  );
};

export default VehicleDetails;
