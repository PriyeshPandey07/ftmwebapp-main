import React, { useEffect, useState } from "react";
import ReusableTable from "../../components/ReusableTable";
import { post } from "../../components/api";
import { SweetAlert } from "../../utils/helper";
import { sortCaret } from "../../../_metronic/_helpers";
import {
  Card,
  CardBody,
} from "../../../_metronic/_partials/controls";
import moment from "moment";

const Feedback = ({ history }) => {
  const ratingFunc = (rating) => {
    let stars = "";

    if (rating > 0) {
      for (let i = 0; i < rating; i++) {
        stars = stars + "⭐";
      }
    } else {
      stars = "Zero Rating";
    }

    return stars;
  };

  const columns = [
    {
      dataField: "client.ownerName",
      text: "Name",
      sort: true,
      show: false,
      sortCaret: sortCaret,
    },
    {
      dataField: "rating",
      text: "Rating",
      sort: true,
      formatter: (cell) => {
        return <p>{ratingFunc(cell)}</p>;
      },
      sortCaret: sortCaret,
    },
    {
      dataField: "message",
      text: "Feedback Message",
      sort: true,
      formatter: (cell) => {
        return <p>{cell ? cell : "N/A"}</p>;
      },
      sortCaret: sortCaret,
    },
    {
      dataField: "createdAt",
      text: "Created At",
      sort: true,
      formatter: (cell) => {
        let formatedDate = moment(cell).format("DD-MM-YYYY");
        return <p>{formatedDate}</p>;
      },
      sortCaret: sortCaret,
    },
  ];

  const [pageData, setPageData] = useState("");
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 10,
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const getFeedbackList = async () => {
    setIsLoading(true);
    try {
      const getList = await post("/superadmin/feedback-list", filters);
      let data = getList.data;
      setPageData(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setPageData([]);
      SweetAlert("Unable to fetch the feedback list, Try again", true);
      history.push("/");
    }
  };
  useEffect(() => {
    getFeedbackList();
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
};

export default Feedback;
