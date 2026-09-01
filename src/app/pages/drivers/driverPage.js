import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from 'moment';
import SVG from "react-inlinesvg";
import { sortCaret, toAbsoluteUrl } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import { showConfirmDialog, SweetAlert } from '../../utils/helper';
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../_metronic/_partials/controls";
import ReusableTable from "../../components/ReusableTable";

function DriverPage({ history }) {
  const columns = [
    {
      dataField: "driverNo",
      text: "Driver No",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "createdAt",
      text: "Date",
      formatter: (cell) => {
        return (
          <p>{moment(cell).format('DD/MM/YYYY HH:mm:ss')}</p>
        );
      },
      sortCaret: sortCaret,
    },
    {
      dataField: "action",
      text: "Actions",
      formatter: (cell, row, rowIndex) => {
        return (
          <>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-edit-tooltip">Edit Device</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-primary btn-sm mx-3"
                onClick={() => history.push(`/devices/edit/${row._id}`)}
              >
                <span className="svg-icon svg-icon-md svg-icon-primary">
                  <SVG
                    src={toAbsoluteUrl(
                      "/media/svg/icons/Communication/Write.svg"
                    )}
                  />
                </span>
              </a>
            </OverlayTrigger>
            <> </>
            <OverlayTrigger
              overlay={
                <Tooltip id="products-delete-tooltip">Delete Device</Tooltip>
              }
            >
              <a
                className="btn btn-icon btn-light btn-hover-danger btn-sm"
                onClick={() => openDeleteDialog(row._id)}
              >
                <span className="svg-icon svg-icon-md svg-icon-danger">
                  <SVG
                    src={toAbsoluteUrl("/media/svg/icons/General/Trash.svg")}
                  />
                </span>
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
    },
  ];
  const [pageData, setPageData] = useState("");
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 10,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await post("/admin/drivers", filters);
        setPageData(response.data);
      } catch (error) {
        // Handle error
        console.log(error);
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

  // delete device
  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog('Delete!', 'Are you sure you want to delete device?');
    if (confirmed) {
      const response = await deleteApi(`/superadmin/device/${id}`);
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
    <Card>
      <CardHeader title="Driver List">
      </CardHeader>
      <CardBody>
        {pageData !== "" ? (
          <ReusableTable
            data={pageData.docs.length > 0 ? pageData.docs : []}
            columns={columns}
            totalSize={pageData.totalDocs}
            page = {pageData !== '' && pageData.page !== '' ? pageData.page : 1}
            limit = {pageData !== '' && pageData.limit !== '' ? pageData.limit : 10}
            updatepaginationOptions = {updatepaginationOptions}
          />
        ) : (
          ""
        )}
      </CardBody>
    </Card>
  );
}

export default DriverPage;
