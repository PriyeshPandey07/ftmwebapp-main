import React, { useEffect, useState } from "react";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import moment from "moment";
import { PencilFill, TrashFill, Search } from 'react-bootstrap-icons';
import { sortCaret } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import { showConfirmDialog, SweetAlert } from "../../utils/helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar
} from "../../../_metronic/_partials/controls";
import ReusableTable from "../../components/ReusableTable";
import { useSelector } from "react-redux";
import debounceSearchParams from "../../components/debounce";

function UserPage({ history }) {
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;
  // const { role } = useSelector(({ auth }) => auth);
  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "role",
      text: "Role",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "createdAt",
      text: "Date",
      formatter: (cell) => {
        return <p>{moment(cell).format("DD/MM/YYYY HH:mm:ss")}</p>;
      },
      sortCaret: sortCaret,
    },
  ];

// Check if the user's role is not "superadmin" to include actions
  if (role !== "admin"  && role !== "accounts") {
    columns.push({
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            {/* Edit User */}
            <OverlayTrigger
              overlay={
                <Tooltip id={`products-edit-tooltip-${rowIndex}`}>
                  Edit User
                </Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/user/edit/${row._id}`)}
              >
                <PencilFill size={16}/>
              </a>
            </OverlayTrigger>

            {/* Delete User */}
            <OverlayTrigger
              overlay={
                <Tooltip id={`products-delete-tooltip-${rowIndex}`}>
                  Delete User
                </Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => openDeleteDialog(row._id)}
              >
                <TrashFill size={16}/>
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
      search: ''
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false);

  const fetchData = async () => {
    try {
      const response = await post("/superadmin/users", filters);
      setPageData(response.data);
      setIsLoading(false);
      setIsBtnLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setIsBtnLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false)
  }, [filters.options.page || filters.options.limit]);

  useEffect(()=> {
    setIsBtnLoading(true)
    const timeoutId = setTimeout(() => {
      debounceSearchParams(fetchData, 1000);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [filters.query, 1000])

  // update pagination options
  const updatepaginationOptions = (options) => {
    let tempFilters = { ...filters };
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    setFilters(tempFilters);
  };

  // delete user
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete user?"
    );
    if (confirmed) {
      const response = await deleteApi(`/superadmin/user/${id}`);
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

  let handleSearchEvent = (value)=> {
    setFilters((prevState)=> ({
      ...prevState,
      query: {
        search: value
      }
    }));
  }

  return (
    <Card>
      <CardHeader>
        <CardHeaderToolbar className="w-100">
          {/* Hide "Add New User" button if userRole is superadmin" */}
          <div className="d-flex justify-content-between align-items-center w-100">
              <div className="input-group w_40">
                <div className={`input-group-prepend input-group-prepend-search searchInputHeight`}>
                  <span className="input-group-text search-icon">
                    <span className="svg-icon svg-icon-sm">
                      <Search color="#4CBABA" size={8}/>
                    </span>
                  </span>
                </div>
                <input
                  placeholder="Search..."
                  type="text"
                  name="name"
                  className="form-control searchCustom"
                  style={{"borderColor":"#E4E6EF"}}
                  autoComplete="off"
                  onChange={(e)=> handleSearchEvent(e.target.value)}
                />
              </div>
                {isBtnLoading ?
                <span style={{"padding-inline": "10px", "padding-top": "3px", "margin-left":"-32rem"}}><Spinner style={{"textAlign": "center"}} animation="border" variant="success" size="md" /></span>
                    : null}
              
              <div>
              {!(role ==="admin" || role === "accounts") && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => history.push("/user/add")}
            >
              Add New User
            </button>
          )}
              </div>
            </div>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {pageData !== undefined && pageData !== null && pageData !== "" && (
          <ReusableTable
            data={pageData !== '' && pageData.docs.length > 0 ? pageData.docs : []}
            columns={columns}
            totalSize={pageData !== '' && pageData.totalDocs !== '' ? pageData.totalDocs : 0}
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
          )}
        </CardBody>
      </Card>
  )
}

export default UserPage;