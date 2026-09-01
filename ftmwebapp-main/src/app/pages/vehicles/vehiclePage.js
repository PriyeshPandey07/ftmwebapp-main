import React, { useCallback, useEffect, useRef, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import moment from "moment";
import SVG from "react-inlinesvg";
import { sortCaret, toAbsoluteUrl } from "../../../_metronic/_helpers";
import { deleteApi, post } from "../../components/api";
import { showConfirmDialog, SweetAlert } from "../../utils/helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import VehicleComponent from "../../components/vehicleComponent";
import Loading from "../../components/LoadingComponent";
import debounceSearchParams from "../../components/debounce";
import { Search } from "react-bootstrap-icons";

function VehiclePage({ history }) {
  const [pageData, setPageData] = useState([]);
  const [filters, setFilters] = useState({
    options: {
      page: 1,
      limit: 9,
    },
    search: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  useEffect(() => {
    console.log("we are calling filters use effect");

    fetchData();
  }, [filters.options.page]);

  useEffect(() => {
    console.log(filters.search);
    if (filters.search != "") {
      console.log(filters.search);
      const timeoutId = setTimeout(() => {
        setFilters((prev) => ({
          ...prev,
          options: { ...prev.options, page: 1 }, // Reset to page 1 when searching
        }));
        setPageData([]); // Clear previous data
        debounceSearchParams(fetchData, 1000);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [filters.search]);

  const fetchData = async () => {
    if (!hasMore) return;
    setIsLoading(true);
    try {
      const response = await post("/superadmin/vehicles", filters);

      if (response.data.docs.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        const sortedData = [...response.data.docs]
          .filter((company) => company.subscriptionDaysLeft < 15) // Get companies with < 15 days
          .sort((a, b) => a.subscriptionDaysLeft - b.subscriptionDaysLeft) // Sort in ascending order
          .concat(
            response.data.docs.filter(
              (company) => company.subscriptionDaysLeft >= 15
            )
          ); // Append remaining in original order
        setPageData((prev) => [...prev, ...sortedData]);
        if (response.data.totalPages == response.data.page) {
          setHasMore(false);
        }
      }
      setIsLoading(false);
    } catch (error) {
      // Handle error
      console.log(error);
      setIsLoading(false);
      setPageData([]);
    }
  };

  const lastVehicleRef = useCallback(
    (node) => {
      if (isLoading || filters.search != "") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setFilters((prev) => ({
            ...prev,
            options: {
              ...prev.options,
              page: prev.options.page + 1,
            },
          }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  let handleSearchEvent = (value) => {
    setFilters((prevState) => ({
      ...prevState,
      search: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardHeaderToolbar className="w-100">
          <div className="d-flex justify-content-between w-100">
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
          </div>
        </CardHeaderToolbar>
      </CardHeader>
      {pageData.length > 0 ? (
        <CardBody>
          <div className="row">
            {pageData.length > 0 ? (
              pageData.map((element, index) => (
                <div
                  key={index}
                  ref={index === pageData.length - 1 ? lastVehicleRef : null}
                  // style={{ width: "33%" }}
                  className="col-lg-4"
                >
                  <VehicleComponent data={element} />
                </div>
              ))
            ) : (
              <p>No Vehicle List Found</p>
            )}
          </div>
          {isLoading ? <Loading /> : null}
        </CardBody>
      ) : null}
    </Card>
  );
}

export default VehiclePage;
