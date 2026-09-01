import React, { useEffect, useState, useCallback } from "react";
import { OverlayTrigger, Tooltip, Tabs, Tab, Spinner } from "react-bootstrap";
import { PencilFill, Plus, TrashFill, Search } from "react-bootstrap-icons";
import moment from "moment";
import { sortCaret } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import { showConfirmDialog, SweetAlert } from "../../utils/helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ReusableTable from "../../components/ReusableTable";
import { useSelector } from "react-redux";
import debounceSearchParams from "../../components/debounce";

function CompanyPage({ history }) {
  const { user } = useSelector(({ auth }) => auth);
  const [search, setSearch] = useState("");
  const role = user ? user.user.role : null;

  const columns = [
    {
      dataField: "name",
      text: "Company Name",
      sort: true,
      show: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "ownerName",
      text: "Owner Name",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "mobileNo",
      text: "Mobile No",
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "email",
      text: "Email",
      sort: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "createdAt",
      text: "Reg. Date",
      formatter: (cell) => {
        return (
          <span style={{ textAlign: "center" }}>
            {moment(cell).format("DD/MM/YYYY")}
          </span>
        );
      },
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "totalVehicles",
      text: "Vehicles",
      formatter: (cell) => {
        return <span>{cell}</span>;
      },
      sort: true,
      sortCaret: sortCaret,
    },
    // {
    //   dataField: "status",
    //   text: "Status",
    //   sort: false,
    //   formatter: (cell) => {
    //     return (
    //       <span
    //         className={
    //           cell === "Approved"
    //             ? `label label-lg label-light-success label-inline`
    //             : cell === "Rejected"
    //             ? `label label-lg label-light-danger label-inline`
    //             : `label label-lg label-light-warning label-inline`
    //         }
    //       >
    //         {cell}
    //       </span>
    //     );
    //   },
    // },
  ];

  // Check if the user's role is not "admin" to include actions
  if (role !== "admin") {
    columns.push({
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Edit Client</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/fleet-owner/edit/${row._id}`)}
              >
                <PencilFill size={16} />
              </a>
            </OverlayTrigger>
            <> </>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">Delete Client</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => openDeleteDialog(row._id)}
              >
                <TrashFill size={16} />
              </a>
            </OverlayTrigger>
          </>
        );
      },
      classes: "text-right pr-0",
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
      status: "",
    },
  });
  const [activeKey, setActiveKey] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await post("/superadmin/companies-list", filters);
      setPageData(response.data);
      setIsLoading(false);
      setIsBtnLoading(false);
    } catch (error) {
      // Handle error
      console.log(error);
      setIsLoading(false);
      setIsBtnLoading(false);
    }
  };

  useEffect(() => {
    console.log("we are here");
    setIsLoading(true);
    fetchData();
  }, [filters.query.status]);

  useEffect(() => {
    setIsBtnLoading(true);
    const timeoutId = setTimeout(() => {
      debounceSearchParams(fetchData, 1000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters.query, 1000]);

  // update pagination options
  const updatepaginationOptions = (options) => {
    const currentSortField = options.sortField;
    const currentSortOrder = filters.options.sortOrder;
    const newSortOrder = currentSortOrder === "asc" ? "desc" : "asc";
    let tempFilters = { ...filters };
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    tempFilters.options.sortField = options.sortField;
    tempFilters.options.sortOrder = newSortOrder; // Update dynamically
    setFilters(tempFilters);
    setIsBtnLoading(true);
    fetchData();
  };

  // delete client
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete client?"
    );
    if (confirmed) {
      const response = await deleteApi(`/superadmin/company/${id}`);
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

  const handleTabChange = (key) => {
    console.log("key ", key);
    let tempFilters = { ...filters };
    if (key === "all") {
      tempFilters.query.status = "";
    } else {
      tempFilters.query.status = key;
    }
    setFilters((prevState) => ({
      ...prevState,
      ...tempFilters,
    }));
    setActiveKey(key);
  };

  let handleSearchEvent = (value) => {
    // setSearch(value);
    setFilters((prevState) => ({
      ...prevState,
      query: {
        search: value,
        status: activeKey === "all" ? "" : activeKey,
      },
    }));
  };

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    // Handle date range change here, e.g., update state or perform an action
    console.log(
      "Selected date range:",
      startDate.format("YYYY-MM-DD"),
      endDate.format("YYYY-MM-DD")
    );
  }, []);

  const GenerateTabData = ({ pageData, columns, updatepaginationOptions }) => {
    return (
      <CardBody>
        <ReusableTable
          data={
            pageData !== "" && pageData.docs.length > 0 ? pageData.docs : []
          }
          columns={columns}
          totalSize={
            pageData !== "" && pageData.totalDocs !== ""
              ? pageData.totalDocs
              : 0
          }
          page={pageData !== "" && pageData.page !== "" ? pageData.page : 1}
          limit={pageData !== "" && pageData.limit !== "" ? pageData.limit : 10}
          updatepaginationOptions={updatepaginationOptions}
          isLoading={isLoading}
        />
      </CardBody>
    );
  };

  return (
    <div className="client-page">
      <div className="d-flex justify-content-end marginb-35">
        {/* Hide "Add New" button if userRole is superadmin */}
        {!(role === "admin") && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/fleet-owner/add")}
          >
            <Plus size={20} /> Add New
          </button>
        )}
      </div>
      <Tabs activeKey={activeKey} onSelect={handleTabChange}>
        <Tab
          eventKey="all"
          title={
            <div>
              All{" "}
              {/* <Badge variant="secondary">
                {pageData !== "" && pageData.docs.length > 0
                  ? pageData.docs.length
                  : 0}
              </Badge> */}
            </div>
          }
        >
          <Card>
            <CardHeader>
              <CardHeaderToolbar className="w-100">
                {/* Hide "Add New User" button if userRole is superadmin" */}
                <div className="d-flex justify-content-start w-100">
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
                  </div>
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
              </CardHeaderToolbar>
            </CardHeader>
            <GenerateTabData
              pageData={pageData}
              columns={columns}
              updatepaginationOptions={updatepaginationOptions}
            />
          </Card>
        </Tab>
        <Tab eventKey="Pending" title={<div>PENDING</div>}>
          <Card>
            <CardHeader>
              <CardHeaderToolbar className="w-100">
                {/* Hide "Add New User" button if userRole is superadmin" */}
                <div className="d-flex justify-content-start w-100">
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
                  </div>
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
              </CardHeaderToolbar>
            </CardHeader>
            <GenerateTabData
              pageData={pageData}
              columns={columns}
              updatepaginationOptions={updatepaginationOptions}
            />
          </Card>
        </Tab>
        <Tab eventKey="Approved" title={<div>APPROVED</div>}>
          <Card>
            <CardHeader>
              <CardHeaderToolbar className="w-100">
                {/* Hide "Add New User" button if userRole is superadmin" */}
                <div className="d-flex justify-content-start w-100">
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
                  </div>
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
              </CardHeaderToolbar>
            </CardHeader>
            <GenerateTabData
              pageData={pageData}
              columns={columns}
              updatepaginationOptions={updatepaginationOptions}
            />
          </Card>
        </Tab>
        <Tab eventKey="Rejected" title={<div>REJECTED</div>}>
          <Card>
            <CardHeader>
              <CardHeaderToolbar className="w-100">
                {/* Hide "Add New User" button if userRole is superadmin" */}
                <div className="d-flex justify-content-start w-100">
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
                  </div>
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
              </CardHeaderToolbar>
            </CardHeader>
            <GenerateTabData
              pageData={pageData}
              columns={columns}
              updatepaginationOptions={updatepaginationOptions}
            />
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default CompanyPage;
