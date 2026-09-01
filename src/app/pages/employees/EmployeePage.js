import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import { deleteApi, post } from "../../components/api";
import { SweetAlert, showConfirmDialog } from "../../utils/helper";
import { sortCaret } from "../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip, Tabs, Tab } from "react-bootstrap";
import { PencilFill, Plus, TrashFill } from "react-bootstrap-icons";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import moment from "moment";
import { useSelector } from "react-redux";

const EmployeePage = ({ history }) => {
  console.log("history  ", history);
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  // delete client
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete employee?"
    );
    if (confirmed) {
      const response = await deleteApi(`/superadmin/employee/${id}`);
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

  const columns = [
    {
      dataField: "name",
      text: "Name",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "empId",
      text: "Employee Id",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "email",
      text: "Email Id",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "dateOfBirth",
      text: "Date of Birth",
      sort: true,
      formatter: (cell) => {
        let formatedDate = moment(cell).format("DD-MM-YYYY");
        return <p>{formatedDate}</p>;
      },
      sortCaret: sortCaret,
    },
    {
      dataField: "mobileNum",
      text: "Mobile Number",
      sort: true,
      sortCaret: sortCaret,
    },
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
        let disabledAnchor = false;

        if (row.empId === "FSEI0001") {
          disabledAnchor = true;
        }
        return disabledAnchor === false ? (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="employee-edit-tooltip">Edit Employee</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/employee/edit/${row._id}`)}
              >
                <PencilFill size={16} />
              </a>
            </OverlayTrigger>
            <> </>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">Delete Employee</Tooltip>
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
        ) : null;
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
  });
  const [isLoading, setIsLoading] = useState(false);

  const getEmployeeList = async () => {
    try {
      setIsLoading(true);
      const getList = await post("/superadmin/employees", filters);
      let data = getList.data;
      setPageData(data);
      setIsLoading(false);
    } catch (error) {
      setPageData([]);
      SweetAlert("Unable to fetch the employee list, Try again", true);
      setIsLoading(false);
      //history.push("/");
    }
  };
  useEffect(() => {
    getEmployeeList();
  }, [filters]);

  // update pagination options
  const updatepaginationOptions = (options) => {
    let tempFilters = { ...filters };
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    setFilters(tempFilters);
  };
  return (
    <>
      {(role !== "admin" ) && (
        <div className="add-user-btn">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push('/employee/add')}
            >
            <Plus size={20} /> Add New
          </button>
        </div>
      )}
      <Card>
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
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default EmployeePage;
