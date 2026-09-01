import React, { useEffect, useState } from "react";
import { toAbsoluteUrl } from "../../_metronic/_helpers";
import { OffcanvasProvider, Offcanvas } from "react-simple-offcanvas";
import VehicleDetail from "../../_metronic/layout/components/extras/offcanvas/vehicleDetails";
import ShareComponent from "./ShareComponent";
import { Link } from "react-router-dom/cjs/react-router-dom";
import { Tooltip, Popover } from "bootstrap";
import moment from "moment";
const VehicleComponent = ({ data, vehicleList, id, history }) => {
  let [vehicleStatusCss, setVehicleStatusCss] = useState("");
  let [vehicleStatus, setVehicleStatus] = useState("");
  let [showOffCanvas, setShowOffCanvas] = useState(false);
  let [vehicleAdd, setShowVehicleAddress] = useState("");

  const handleClose = () => setShowOffCanvas(false);
  const handleOpen = () => setShowOffCanvas(true);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  let [vehicleData, setVehicleData] = useState({
    vehicleNo: "",
    startDate: "",
    endDate: "",
    vehicleModel: "",
    vehicleImage: "placeholder-truck.png",
    clientName: "",
    subscriptionDaysLeft: "",
  });

  const updateStatus = (status) => {
    switch (status) {
      case "moving":
        setVehicleStatusCss("#0C8017");
        setVehicleStatus("MOVING");
        break;
      case "idle":
        setVehicleStatus("IDLE");
        setVehicleStatusCss("#F7D24F");
        break;
      case "stopped":
        setVehicleStatus("STOPPED");
        setVehicleStatusCss("#E2473F");
        break;
      case "offline":
        setVehicleStatus("OFFLINE");
        setVehicleStatusCss("#E2473F");
        break;
      default:
        setVehicleStatus("N/A");
        setVehicleStatusCss("grey");
        break;
    }
  };

  const handleDataChange = async (data) => {
    setVehicleData({
      vehicleNo: data.vehicleNo,
      startDate: data.subscriptionData.startDate,
      endDate: data.subscriptionData.endDate,
      vehicleModel: data.truckModelData.name,
      vehicleImage: data.vehiclePhoto,
      clientName: data.clientData.name,
      subscriptionDaysLeft: data.subscriptionDaysLeft,
    });
  };

  useEffect(() => {
    updateStatus(data.tripVehicleStatus);
    handleDataChange(data);
  }, []);

  return (
    <>
      {openModal ? (
        <ShareComponent
          vehicle_id={data._id}
          vehicleNo={data.vehicleNo}
          show={openModal}
          handleClose={handleCloseModal}
        />
      ) : null}
      <div>
        <div
          className="container-vehicle"
          onClick={() => handleOpen()}
          style={
            vehicleData.subscriptionDaysLeft < 15
              ? { border: "2px solid #ff00007d" }
              : null
          }
        >
          <div
            className="status-label"
            style={{ background: `${vehicleStatusCss}` }}
          >
            {vehicleStatus}
          </div>
          <div className="inner-container justify-content-between">
            <div className="d-flex">
              <div className="image">
                <img
                  className="rounded_radius"
                  src={toAbsoluteUrl("/media/vehicle-sample.png")}
                  width="35px"
                  height="35px"
                />
              </div>
              <div className="vehicle_details">
                {" "}
                {/* display flex, flex direction column */}
                <div className="number_model_details">
                  {/* <p className="vehicle_number">{vehicleData.vehicleNo}</p> */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "center",
                    }}
                  >
                    <Link
                      to={`vehicleDetails/${vehicleData.vehicleNo}`}
                      className="vehicle_number"
                    >
                      <span>{vehicleData.vehicleNo}</span>
                    </Link>
                    <p
                      className="mb-0 ml-3 truck_model"
                      style={{ fontSize: "10px" }}
                    >{`${moment(vehicleData.startDate).format(
                      "DD/MM/YY"
                    )} to ${moment(vehicleData.endDate).format(
                      "DD/MM/YY"
                    )} - (${Math.ceil(vehicleData.subscriptionDaysLeft)})`}</p>
                  </div>
                  <p className="truck_model">{vehicleData.vehicleModel}</p>
                </div>
                <p className="client_company">{vehicleData.clientName}</p>
                <p
                  className="company_address"
                  data-bs-toggle="tooltip"
                  data-bs-placement="bottom"
                  title={data.location}
                >
                  {data.location?.length > 70
                    ? `${data.location.substring(0, 70)}...`
                    : data.location}
                </p>
              </div>
            </div>
            <span className="share_btn" onClick={() => handleOpenModal()}>
              <img
                src={toAbsoluteUrl("/media/svg/icons/Home/Share.svg")}
                width="15px"
              />
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleComponent;
