import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import Button  from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { ReactSelect } from "../../../_metronic/_partials/controls";
import { put } from "../../components/api";
import { SweetAlert } from "../../utils/helper";


const SupportEditPage = ({showmodal, handleclose, data, getSupportType, handleUpdate}) => {
    console.log("data in modal ", data.status);
    let initialStatus = data.status;

    let [initialData,setInitialData] = useState({_id: initialStatus, name:initialStatus.toUpperCase() })

    let checkStatus = (status)=> {
        let allowedStatus = [];
        switch (status) {
            case "open":
                allowedStatus.push({_id: "in-progress", name: "IN-PROGRESS"});
                allowedStatus.push({_id: "resolved", name: "RESOLVED"});
                break;
            case "in-progress":
              allowedStatus.push({_id: "open", name: "OPEN"});
              allowedStatus.push({_id: "resolved", name: "RESOLVED"});
                break;
            default: 
                break;
        }

        return allowedStatus;
    }

    // let handleUpdateStatus =  (id)=> {
    //     async function updateStatus (id) {
    //         let updateStatus = await put(`/superadmin/supports/edit/${id}`);
    // if (updateStatus.status === 200) {
    //     SweetAlert(updateStatus.message, false)
    // } else {
    //     SweetAlert(updateStatus.message, true)
    // }
    //     }
    //     updateStatus(id);
    // }

    const onChangeSelect = (name, value)=> {
        console.log('name ', name);
        console.log('value ', value)
        setInitialData(prevState => ({
           ...prevState,
           _id: value._id,
           name: value.name 
        }))
    }
    

    return (
        <Modal show={showmodal} onHide={handleclose} backdrop="static">
            <Modal.Header closeButton>
            <Modal.Title>Support Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
        <ListGroup variant="flush">
            <ListGroup.Item>Client Name : {data.client.ownerName}</ListGroup.Item>
            <ListGroup.Item>Vehicle Number : {data.vehicle.vehicleNo}</ListGroup.Item>
            <ListGroup.Item>Support Type : {getSupportType(data.supportType)}</ListGroup.Item>
            <ListGroup.Item>Support Message : {(data.message !== "") ? data.message : "N/A"}</ListGroup.Item>
            <ListGroup.Item>
            <label>Status</label>
            <ReactSelect name="status" value={initialData} options={checkStatus(data.status)} isSearchable={true} noOptionsMessage="No Option Available" placeholder="Select Status" handleOnChange={onChangeSelect} />
            </ListGroup.Item>
        </ListGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleclose}>
              Close
            </Button>
            <Button variant="primary" onClick={()=> handleUpdate(data._id, {status: initialData._id})}>
              Save
            </Button>
          </Modal.Footer>
        </Modal>
    )
}

export default SupportEditPage;
