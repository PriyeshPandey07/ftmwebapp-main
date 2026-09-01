import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { WhatsappIcon, WhatsappShareButton } from "react-share";
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import copy from "clipboard-copy";
import { post } from "./api";
import { SweetAlert } from "../utils/helper";
import TextInputComponent from "./TextInputComponent";

const ShareComponent = ({ vehicle_id, show, handleClose }) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [selectedDay, setSelectedDay] = useState("0d");
  const [selectedHour, setSelectedHour] = useState("0h");
  const [errorMessage, setErrorMessage] = useState("");

  const copyToClipboard = () => {
    copy(shareUrl);
    SweetAlert("Link copy successfully.", false);
  }

  const handleCreateShareLink = async () => {
    if (selectedDay === "0d" && selectedHour === "0h") {
      setErrorMessage("Please select at least 1 hour to create the link.");
    } else {
      try {
        setLoading(true);
        let jsonData = {
          vehicle_id: vehicle_id
        }
        if (selectedDay !== '0d') {
          jsonData.timeframe = selectedDay;
        }
        if (selectedHour !== '0h') {
          jsonData.timeframe = selectedHour;
        }
        const getToken = await post("/generate-token", jsonData);
        if (getToken.data && getToken.data.token !== undefined) {
          setLoading(false);
          setShareUrl(
            `${process.env.REACT_APP_SITE_URL}share/${getToken.data.token}`
          );
          SweetAlert(getToken.message, false);
        } else {
          setShareUrl("");
          SweetAlert(getToken.message, true);
          setLoading(false);
          handleClose();
        }
      } catch (error) {
        SweetAlert(error.message, true);
        setLoading(false);
        setShareUrl("");
        handleClose();
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} className="share-link-modal">
      <Modal.Header closeButton>
        <Modal.Title>Share Vehicle Real Time Tracking</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h5>
            Expire the share link after
          </h5>
          <div className="form-group row">
            <label className="col-sm-1 col-form-label">Days</label>
            <div className="col-sm-3">
              <select
                className="form-control"
                id="expireDays"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {Array.from({ length: 4 }, (_, i) => (
                  <option key={i} value={`${i}d`}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
            {selectedDay === "0d" && (
              <>
                <label className="col-sm-1 mr-2 col-form-label">Hours</label>
                <div className="col-sm-3">
                  <select
                    className="form-control"
                    id="expireHours"
                    value={selectedHour}
                    onChange={(e) => setSelectedHour(e.target.value)}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={`${i}h`}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          {errorMessage && (
            <div className="text-danger" style={{ marginTop: "4px" }}>
              {errorMessage}
            </div>
          )}
        </div>
        {shareUrl !== "" && <div className="row d-flex align-items-center">
          <div className="col-md-10 col-lg-10">
            <TextInputComponent
              label={"ShareUrl for Live Tracking"}
              placeholder={"ShareUrl for Live Tracking"}
              inputType={"text"}
              isRequired={false}
              isDisabled={true}
              value={shareUrl}
            />
          </div>
          <div className="col-md-1 col-lg-1 mt-7 p-0 cursor-pointer" onClick={copyToClipboard}>
            <FileCopyOutlinedIcon fontSize={'large'} />
          </div>
          <div className="col-md-1 col-lg-1 mt-7 p-0 cursor-pointer">
            <WhatsappShareButton
              url={shareUrl}
              className="Demo__some-network__share-button"
            >
              <WhatsappIcon size={32} />
            </WhatsappShareButton>
          </div>
        </div>}
      </Modal.Body>
      <Modal.Footer>
        <button
          disabled={loading}
          className="btn btn-success"
          style={{ fontSize: "0.85rem", marginLeft: "-10px" }}
          onClick={handleCreateShareLink}
        >
          Create Share Link
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareComponent;
