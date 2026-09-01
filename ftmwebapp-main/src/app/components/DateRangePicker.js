import React, { useState, useRef } from "react";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-daterangepicker/daterangepicker.css";

const CustomDateRangePicker = (props) => {
  const [startDate, setStartDate] = useState(moment());
  const [endDate, setEndDate] = useState(moment());

  const dateRangePickerRef = useRef(null);

  const handleApply = (event, picker) => {
    console.log("picker", picker);
    setStartDate(picker.startDate);
    setEndDate(picker.endDate);
    if (typeof props.getUpdatedDateRange == "function") {
      props.getUpdatedDateRange([picker.startDate, picker.endDate]);
    }
  };

  const handleCancel = () => {
    setStartDate(null);
    setEndDate(null);
    dateRangePickerRef.current.handleCancel();
  };

  console.log("props ", props);
  let classes =
    props.isFullWidth == true ? "input-group w-100" : "input-group w-30";

  return (
    <div className={classes} style={{ height: "auto" }}>
      <DateRangePicker
        onApply={handleApply}
        onCancel={handleCancel}
        initialSettings={{
          startDate: startDate.toDate(),
          endDate: endDate.toDate(),
          maxDate: moment(),
          minDate: moment().subtract(365, "days"),
          alwaysShowCalendars: true,
          ranges: {
            Today: [moment().toDate(), moment().toDate()],
            Yesterday: [
              moment()
                .subtract(1, "days")
                .toDate(),
              moment()
                .subtract(1, "days")
                .toDate(),
            ],
            "Last 7 Days": [
              moment()
                .subtract(6, "days")
                .toDate(),
              moment().toDate(),
            ],
            "Last 30 Days": [
              moment()
                .subtract(29, "days")
                .toDate(),
              moment().toDate(),
            ],
            "This Month": [
              moment()
                .startOf("month")
                .toDate(),
              moment()
                .endOf("month")
                .toDate(),
            ],
            "Last Month": [
              moment()
                .subtract(1, "month")
                .startOf("month")
                .toDate(),
              moment()
                .subtract(1, "month")
                .endOf("month")
                .toDate(),
            ],
          },
        }}
      >
        <input placeholder={null} type="text" className="form-control" />
      </DateRangePicker>
    </div>
  );
};

export default CustomDateRangePicker;
