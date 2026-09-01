import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import { deleteApi, post } from "../../components/api";
import { SweetAlert, showConfirmDialog } from "../../utils/helper";
import { sortCaret } from "../../../_metronic/_helpers";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { PencilFill, Plus, TrashFill } from "react-bootstrap-icons";
import {
  Card,
  CardBody,
} from "../../../_metronic/_partials/controls";
import { useSelector } from "react-redux";

const FaqPage = ({ history }) => {
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  // delete client
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete employee?"
    );
    if (confirmed) {
      const response = await deleteApi(`/superadmin/faqs/delete/${id}`);
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
      dataField: "title",
      text: "Title",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "description",
      text: "Description",
      sort: true,
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
            <OverlayTrigger
              overlay={<Tooltip id="employee-edit-tooltip">Edit Faqs</Tooltip>}
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/faq/edit/${row._id}`)}
              >
                <PencilFill size={16} />
              </a>
            </OverlayTrigger>
            <> </>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">Delete Faq</Tooltip>
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
  });
  const [isLoading, setIsLoading] = useState(false);

  const getFaqList = async () => {
    try {
      setIsLoading(true);
      const getList = await post("/superadmin/faqs-list", filters);
      setPageData(getList.data);
      setIsLoading(false);
    } catch (error) {
      setPageData([]);
      SweetAlert("Unable to fetch the faqs list, Try again", true);
      setIsLoading(false);
      //history.push("/");
    }
  };
  useEffect(() => {
    getFaqList();
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
      {role !== "admin" && (
        <div className="add-user-btn">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => history.push("/faq/add")}
          >
            <Plus size={20} /> Add New
          </button>
        </div>
      )}
      <Card>
        <CardBody>
          <ReusableTable
            data={pageData !== '' && pageData.docs.length > 0 ? pageData.docs : []}
            columns={columns}
            totalSize={pageData !== '' && pageData.totalDocs !== '' ? pageData.totalDocs : 0}
            page = {pageData !== '' && pageData.page !== '' ? pageData.page : 1}
            limit = {pageData !== '' && pageData.limit !== '' ? pageData.limit : 10}
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>
    </>
  );
};

export default FaqPage;
