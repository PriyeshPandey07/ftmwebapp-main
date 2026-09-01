import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { PencilFill, Plus, TrashFill } from 'react-bootstrap-icons';
import { sortCaret, toAbsoluteUrl } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import { showConfirmDialog, SweetAlert } from '../../utils/helper';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import ReusableTable from "../../components/ReusableTable";
import { useSelector } from "react-redux";

function PlanPage({ history }) {
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  const shouldShowActions = role !== "admin" && role !== "accounts";

  const columns = [
    {
      dataField: "type",
      text: "Plan type",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "unitPrice",
      text: "Unit Price",
      sort: true,
      sortCaret: sortCaret,
    },
    {
        dataField: "discountedPrice",
        text: "Discounted Price",
        sort: true,
        sortCaret: sortCaret,
    },
    {
        dataField: "perMonth",
        text: "Monthly Price",
        sort: true,
        sortCaret: sortCaret,
    },
    {
      dataField: "year",
      text: "Year",
      sort: true,
      sortCaret: sortCaret,
    },
    {
      dataField: "discount",
      text: "Discount",
      sort: true,
      sortCaret: sortCaret,
      formatter: (cell)=> {
        return (<p>{cell}%</p>)
      }
    },
    
  ];

  if (shouldShowActions) {
    columns.push({
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Edit Plan</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/plans/edit/${row._id}`)}
              >
                <PencilFill size={16}/>
              </a>
            </OverlayTrigger>
            <> </>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">Delete Plan</Tooltip>
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
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await post("/superadmin/plan-list", filters);
        setPageData(response.data);
        setIsLoading(false);
      } catch (error) {
        // Handle error
        console.log(error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // update pagination options
  const updatepaginationOptions = (options) => {
    let tempFilters = {...filters}
    tempFilters.options.page = options.page;
    tempFilters.options.limit = options.sizePerPage;
    setFilters(tempFilters);
  }

  // delete plan
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog('Delete!', 'Are you sure you want to delete plan?');
    if (confirmed) {
      const response = await deleteApi(`/superadmin/plan/${id}`);
      if (response.data.status === 200) {
        let tempPageData = {...pageData};
        tempPageData.docs = pageData.docs.filter(item => item._id !== id);
        SweetAlert(response.data.message, false);
        setPageData(tempPageData);
      } else {
        SweetAlert(response.data.message, true);
      }
    }
  };

  return (
    <>
      {shouldShowActions && (
          <div className="add-user-btn">
              <button
                type="button"
                className="btn btn-primary w-150"
                onClick={() => history.push('/plans/add')}
              >
                <Plus size={20} /> Add New Plan
              </button>
              </div>
      )}
      <Card>
        <CardBody>
          <ReusableTable
            data={pageData !== '' && pageData.docs.length > 0 ? pageData.docs : []}
            columns={columns}
            totalSize={pageData !== '' && pageData.totalDocs !== '' ? pageData.totalDocs : 0}
            updatepaginationOptions={updatepaginationOptions}
            isLoading={isLoading}
          />
        </CardBody>
      </Card>
    </>
  );
}

export default PlanPage;
