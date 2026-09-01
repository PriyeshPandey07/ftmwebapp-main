import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";

const DeviceDetailsPage = ({ showmodal, handleclose, data, dateChange }) => {
  let updatedAt;
  updatedAt = data.updated_at ? dateChange(data.updated_at) : "N/A";
  return (
    <Modal
      show={showmodal}
      onHide={handleclose}
      size="xl"
      style={{
        display: "felx",
        alignItems: "ceter",
        justifyContent: "center",
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Device Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>Model Name: {data.modelName}</ListGroup.Item>
          <ListGroup.Item>Imei No: {data.ImeiNo}</ListGroup.Item>
          <ListGroup.Item>Serial No: {data.serialNo}</ListGroup.Item>
          <ListGroup.Item>
            ICCID No: {data.iccid ? data.iccidNo : "N/A"}
          </ListGroup.Item>
          <ListGroup.Item>
            IMSI No: {data.imsi ? data.imsiNo : "N/A"}
          </ListGroup.Item>
          <ListGroup.Item>
            Configuration: {data.configuration ? data.configuration : "N/A"}
          </ListGroup.Item>
          <ListGroup.Item>
            Firmware: {data.firmware ? data.firmware : "N/A"}
          </ListGroup.Item>
          <ListGroup.Item>Updated At: {updatedAt}</ListGroup.Item>
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleclose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeviceDetailsPage;
