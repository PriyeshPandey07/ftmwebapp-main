import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import moment from "moment";
import { EyeFill, Plus, Search, TrashFill } from "react-bootstrap-icons";
import { sortCaret } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import DeviceDetialsPage from "./deviceDetails";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ReusableTable from "../../components/ReusableTable";
import { useSelector } from "react-redux";
import debounceSearchParams from "../../components/debounce";
import { showConfirmDialog, SweetAlert } from "../../utils/helper";
// import { AiFillCloseSquare } from "react-icons/ai";

function DevicePage({ history }) {
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;
  const shouldShowActions = role !== "admin" && role !== "accounts";
  const columns = [
    {
      dataField: "modelName",
      text: "Model Name",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "serialNo",
      text: "Serial No",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "ImeiNo",
      text: "IMEI No",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "iccidNo",
      text: "ICCID No",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "imsiNo",
      text: "IMSI No",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "status",
      text: "Status",
      formatter: (cell) => {
        return (
          <span
            className={
              cell === "Online"
                ? `label label-lg label-light-success label-inline`
                : cell === "Inactive"
                ? `label label-lg label-light-danger label-inline`
                : `label label-lg label-light-warning label-inline`
            }
          >
            {cell}
          </span>
        );
      },
    },
    {
      dataField: "updatedAt",
      text: "Updated At",
      formatter: (cell) => {
        return <span>{moment(cell).format("DD-MM-YYYY HH:mm:ss")}</span>;
      },
    },
  ];

  const changeFormatOfDate = (date) => {
    return moment(date).format("DD-MM-YYYY HH:mm:ss");
  };

  if (shouldShowActions) {
    columns.push({
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id={`device-detiails-tooltip-${rowIndex}`}>
                  View Device
                </Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-lg"
                onClick={() => openDetailsDialog(row)}
              >
                <EyeFill size={16} />
              </a>
            </OverlayTrigger>
          </>
        );
      },
      classes: "text-center pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    });
  }
  if (shouldShowActions) {
    columns.push({
      dataField: "delete",
      text: "Delete",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id={`device-detiails-tooltip-${rowIndex}`}>
                  Delete Device
                </Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-lg"
                onClick={() => openDeleteDialog(row._id)}
              >
                <TrashFill size={16} />
              </a>
            </OverlayTrigger>
          </>
        );
      },
      classes: "text-center pr-0",
      headerClasses: "text-right pr-3",
      style: {
        minWidth: "100px",
      },
    });
  }

  const [pageData, setPageData] = useState("");
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 10,
    },
    query: {
      search: "",
    },
  });

  const [showDetialsDialog, setShowDetailsDialog] = useState(false);
  const [detialsData, setDetailsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    modelName: "FMB920",
    ImeiNo: "",
    serialNo: "",
    iccidNo: "",
    imsiNo: "",
    status: "Inactive",
    brand: "Teletonika",
  });
  const fetchData = async () => {
    try {
      const response = await post("/superadmin/fota-device-list", filters);
      setPageData(response.data);
      setIsLoading(false);
      setIsBtnLoading(false);
    } catch (error) {
      setPageData("");
      setIsLoading(false);
      setIsBtnLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
  }, [filters.options.page || filters.options.limit]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      debounceSearchParams(fetchData, 1000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters.query, 1000]);

  // update pagination options
  const updatepaginationOptions = (options) => {
    let tempFilters = { ...filters };
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    setFilters(tempFilters);
  };

  //delete device
  const openDetailsDialog = (data) => {
    setDetailsData(data);
    setShowDetailsDialog(true);
  };

  const closeDetailsDialog = () => {
    setDetailsData({});
    setShowDetailsDialog(false);
  };

  let handleSearchEvent = (value) => {
    setFilters((prevState) => ({
      ...prevState,
      query: {
        search: value,
      },
    }));
    setIsBtnLoading(true);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const response = await post("/superadmin/device/add", formData);
    if (response.status === 200) {
      SweetAlert(response.message, false);
      fetchData();
    }
    setShowModal(false); // Close modal after submission
  };

  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete user?"
    );
    if (confirmed) {
      const response = await deleteApi(`/superadmin/device/${id}`);
      if (response.data.status === 200) {
        let tempPageData = { ...pageData };
        tempPageData.docs = pageData.docs.filter((item) => item._id !== id);
        SweetAlert(response.data.message, false);
        setPageData(tempPageData);
      } else {
        SweetAlert(response.data.message, true);
      }
    }
  };

  return (
    <div>
      <DeviceDetialsPage
        showmodal={showDetialsDialog}
        handleclose={closeDetailsDialog}
        data={detialsData}
        dateChange={changeFormatOfDate}
      />

      <Card>
        <CardHeader>
          <CardHeaderToolbar className="w-100">
            <div className="d-flex justify-content-between align-items-center w-100">
              <div className="input-group w_40">
                <div
                  className={`input-group-prepend input-group-prepend-search searchInputHeight`}
                >
                  <span className="input-group-text search-icon">
                    <span className="svg-icon svg-icon-sm">
                      <Search color="#4CBABA" size={8} />
                    </span>
                  </span>
                </div>
                <input
                  placeholder="Search..."
                  type="text"
                  name="name"
                  className="form-control searchCustom"
                  style={{ borderColor: "#E4E6EF" }}
                  autoComplete="off"
                  onChange={(e) => handleSearchEvent(e.target.value)}
                />
                {isBtnLoading ? (
                  <span
                    style={{ "padding-inline": "10px", "padding-top": "3px" }}
                  >
                    <Spinner
                      style={{ textAlign: "center" }}
                      animation="border"
                      variant="success"
                      size="md"
                    />
                  </span>
                ) : null}
              </div>
              <div>
                {/* <button style={{"color" : "white"}} onClick={() => setShowModal(true)}>+Add device</button> */}
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  <Plus size={20} /> Add New
                </button>
              </div>
            </div>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <ReusableTable
            data={
              pageData !== "" && pageData.docs.length > 0 ? pageData.docs : []
            }
            columns={columns}
            page={pageData !== "" && pageData.page !== "" ? pageData.page : 1}
            limit={
              pageData !== "" && pageData.limit !== "" ? pageData.limit : 10
            }
            totalSize={
              pageData !== "" && pageData.totalDocs !== ""
                ? pageData.totalDocs
                : 0
            }
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h2 className="modal-header">Add Device</h2>
            <form className="modal-form" onSubmit={handleModalSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="modelName">Model Name:</label>
                  <select
                    id="modelName"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleModalChange}
                  >
                    <option value="FMB920">FMB920</option>
                    <option value="AIS140">AIS140</option>
                    <option value="EV02">EV02</option>
                    <option value="V5">V5</option>
                    {/* Add more options if needed */}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleModalChange}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="ImeiNo">IMEI Number:</label>
                  <input
                    type="text"
                    id="ImeiNo"
                    name="ImeiNo"
                    value={formData.ImeiNo}
                    onChange={handleModalChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="serialNo">Serial Number:</label>
                  <input
                    type="text"
                    id="serialNo"
                    name="serialNo"
                    value={formData.serialNo}
                    onChange={handleModalChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="iccidNo">ICCID Number:</label>
                  <input
                    type="text"
                    id="iccidNo"
                    name="iccidNo"
                    value={formData.iccidNo}
                    onChange={handleModalChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="imsiNo">IMSI Number:</label>
                  <input
                    type="text"
                    id="imsiNo"
                    name="imsiNo"
                    value={formData.imsiNo}
                    onChange={handleModalChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="brand">Brand:</label>
                  <select
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleModalChange}
                  >
                    <option value="Teletonika">Teletonika</option>
                    <option value="Atlanta">Atlanta</option>
                    <option value="Concox">Concox</option>
                  </select>
                </div>
              </div>

              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DevicePage;
