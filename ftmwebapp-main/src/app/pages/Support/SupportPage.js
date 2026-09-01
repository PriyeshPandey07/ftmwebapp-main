import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import { post, put } from "../../components/api";
import { SweetAlert } from "../../utils/helper";
import { sortCaret, toAbsoluteUrl } from "../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip, Spinner } from "react-bootstrap";
import { PencilFill, Search } from "react-bootstrap-icons";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import moment from "moment";
import { useSelector } from "react-redux";
import SupportEditPage from "./SupportEditModal";
import SVG from "react-inlinesvg";
import debounceSearchParams from "../../components/debounce";
import ReactTooltip from "react-tooltip";

const SupportPage = ({ history }) => {
  console.log("history  ", history);
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  const [showEditSupport, setShowEditSupport] = useState(false);
  const [supportData, setSupportData] = useState();
  const [searchParams, setSearchParams] = useState("");
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const openEditSupportDialog = (data) => {
    console.log("row id ", data);
    setSupportData(data);
    setShowEditSupport(true);
  };

  const closeEditSupport = () => {
    setSupportData({});
    setShowEditSupport(false);
  };

  const getSupportType = (supportNum) => {
    let supportType;

    switch (supportNum) {
      case 1:
        supportType = "GPS Related Issue";
        break;
      case 2:
        supportType = "Sensor Related Issue";
        break;
      case 3:
        supportType = "Account Related Issue";
        break;
      case 4:
        supportType = "Report Not Generated";
        break;
      case 5:
        supportType = "Vehicle Tracking Issue";
        break;
      default:
        supportType = "Other";
        break;
    }

    return supportType;
  };

  const columns = [
    {
      dataField: "supportId",
      text: "Support Id",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "client.ownerName",
      text: "ClientName",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "vehicle.vehicleNo",
      text: "Vehicle No",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "supportType",
      text: "Support Type",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        let supportType = getSupportType(cell);
        return <p>{supportType}</p>;
      },
    },
    {
      dataField: "status",
      text: "Support Status",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        return (
          <span
            className={
              cell === "open"
                ? `label label-lg label-light-primary label-inline`
                : cell === "in-progress"
                ? `label label-lg label-light-warning label-inline`
                : cell === "rejected"
                ? `label label-lg label-light-danger label-inline`
                : `label label-lg label-success label-inline`
            }
            style={{ paddingBlock: "17px" }}
          >
            {cell.toUpperCase()}
          </span>
        );
      },
    },
    {
      dataField: "message",
      text: "Support Message",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell) => {
        if (cell === null || cell === "") {
          return <p>N/A</p>;
        } else {
          return (
            <>
              <p
                data-tip={cell} // Tooltip content
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "200px",
                }}
              >
                {cell}
              </p>
              <ReactTooltip
                place="top"
                type="dark"
                effect="solid"
                stylr={{
                  maxWidth: "200px",
                }}
              />
            </>
          );
        }
      },
    },
    // {
    //   dataField: "message",
    //   text: "Support Message",
    //   sort: true,
    //   sortCaret: sortCaret,
    //   formatter: (cell) => {
    //     if (cell === null || cell === "") {
    //       return <p>N/A</p>;
    //     } else {
    //       return (
    //         <p
    //           className="width-200"
    //           style={{ height: "100px", overflow: "auto" }}
    //         >
    //           {cell}
    //         </p>
    //       );
    //     }
    //   },
    // },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      formatter: (cell) => {
        let formatedDate = moment(cell).format("DD/MM/YYYY HH:mm:ss");
        return <p>{formatedDate}</p>;
      },
      sortCaret: sortCaret,
    },
  ];

  // Check if the user's role is not "admin" to include actions
  if (role !== "admin") {
    columns.push({
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        console.log("cell ", cell);
        console.log("row ", row);
        console.log("rowIndex ", rowIndex);

        return (
          <>
            {row.status == "resolved" || row.status == "rejected" ? null : (
              <OverlayTrigger
                overlay={
                  <Tooltip id="employee-edit-tooltip">Update Status</Tooltip>
                }
              >
                <a
                  className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                  onClick={() => openEditSupportDialog(row)}
                >
                  <PencilFill size={20} />
                </a>
              </OverlayTrigger>
            )}
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

  const [pageData, setPageData] = useState([]);
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 10,
    },
    query: {
      search: "",
    },
  });

  const getSupportList = async () => {
    try {
      const getList = await post("/superadmin/supports", filters);
      let data = getList.data;
      console.log("dat ", getList);
      if (data.length === 0) {
        setPageData([]);
      } else {
        setPageData(data);
      }
      setIsBtnLoading(false);
    } catch (error) {
      setPageData([]);
      SweetAlert("Unable to fetch the support list, Try again", true);
      console.log("error ", error);
      setIsBtnLoading(false);
      //history.push("/");
    }
  };

  useEffect(() => {
    getSupportList();
  }, [filters.options.page || filters.options.limit]);

  useEffect(() => {
    setIsBtnLoading(true);
    const timeoutId = setTimeout(() => {
      debounceSearchParams(getSupportList, 1000);
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

  let handleUpdateStatus = (id, statusObj) => {
    async function updateStatus(id, statusObj) {
      let updateStatus = await put(
        `/superadmin/supports/edit/${id}`,
        statusObj
      );
      if (updateStatus.status === 200) {
        SweetAlert(updateStatus.message, false);
        setShowEditSupport(false);
        await getSupportList();
      } else {
        SweetAlert(updateStatus.message, true);
      }
    }
    updateStatus(id, statusObj);
  };

  let handleSearchEvent = (value) => {
    console.log("value ", value);
    setFilters((prevState) => ({
      ...prevState,
      query: {
        search: value,
      },
    }));
    setSearchParams(value);
  };

  return (
    <>
      {showEditSupport ? (
        <SupportEditPage
          showmodal={showEditSupport}
          handleclose={closeEditSupport}
          data={supportData}
          getSupportType={getSupportType}
          handleUpdate={handleUpdateStatus}
        />
      ) : (
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
          <CardBody>
            {pageData.length !== 0 ? (
              <ReusableTable
                data={pageData.docs}
                columns={columns}
                totalSize={pageData.totalDocs}
                updatepaginationOptions={updatepaginationOptions}
              />
            ) : (
              <p>No support ticket found!</p>
            )}
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default SupportPage;
