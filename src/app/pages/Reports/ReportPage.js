import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { SweetAlert } from "../../utils/helper";
import { post } from "../../components/api";
import SelectInputComponent from "../../components/SelectInputComponent";
import TextInputComponent from "../../components/TextInputComponent";
import moment from "moment";
import ButtonComponent from "../../components/ButtonComponent";
import CustomDateRangePicker from "../../components/DateRangePicker";

const ReportPage = ({ history }) => {
  // back to listing page
  const backToDashboard = () => {
    history.push(`/dashboard`);
  };

  const formikInitialValues = {
    empId: "",
    clientId: "",
    vehicleNo: "",
    reportType: "",
    singleDate: "",
    monthlyDate: "",
    startDate: "",
    endDate: "",
  };

  const formik = useFormik({
    initialValues: formikInitialValues,
  });

  const get18YearOld = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm + "-" + dd;
    console.log("today ", today);
    return today;
  };

  const getMonth = () => {
    var today = new Date();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (mm < 10) {
      mm = "0" + mm;
    }

    today = yyyy + "-" + mm;
    console.log("today ", today);
    return today;
  };

  const getMonthlyDate = (date) => {
    console.log("dat ", date);
    formik.setFieldValue("monthlyDate", date);
  };

  //  const filters = {
  //     options: {
  //         page: 1,
  //         limit: 100,
  //       },
  //  }
  const [employeeData, setEmployeeData] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [isVehicleSelected, setIsVehicleSelected] = useState(false);
  const [isReportSelected, setIsReportSelected] = useState(false);
  const [dateType, setDateType] = useState("");
  const [reportTypeStr, setReportTypeStr] = useState("");

  const reportTypes = [
    {
      name: "24 Hours Report",
      _id: "24Hours",
    },
    {
      name: "Monthly Report",
      _id: "Monthly",
    },
    {
      name: "Fuel Consumption Report",
      _id: "fuelConsumption",
    },
    {
      name: "Idle Report",
      _id: "idle",
    },
    {
      name: "Ignition Report",
      _id: "ignition",
    },
  ];

  const getEmployeeList = async () => {
    try {
      const getList = await post("/superadmin/employees");
      let data = getList.data.docs;
      setEmployeeData(data);
    } catch (error) {
      setEmployeeData([]);
      SweetAlert("Unable to fetch the employee data, Try again", true);
      //history.push("/");
    }
  };

  const getClientListPerEmployee = async (empId) => {
    try {
      let clientList = await post("/get-companies-by-empId", { empId: empId });
      let updatedArray = [];
      let data = clientList.data;
      console.log("empid ", empId);
      console.log("clie4nt ", data);
      if (data.length > 0) {
        data.forEach((element) => {
          let updatedElement = { ...element };
          updatedElement.name = element.ownerName;
          delete updatedElement.ownerName;
          updatedArray.push(updatedElement);
        });
      }
      setClientList(updatedArray);
    } catch (error) {
      console.log("error in fetching the client list");
      setClientList([]);
    }
  };

  const getVehicleListPerClient = async (clientId) => {
    try {
      console.log("client ", clientId);
      let vehicleList = await post("/superadmin/vehicles", {
        clientId: clientId,
      });
      let updatedArray = [];
      let data = vehicleList.data.docs;
      console.log("vehicle datra ", data);
      if (data.length > 0) {
        data.forEach((element) => {
          let updatedElement = {};
          updatedElement.name = element.vehicleNo;
          updatedElement._id = element.vehicleNo;
          updatedArray.push(updatedElement);
        });
      }
      if (updatedArray.length > 0) {
        setIsVehicleSelected(true);
      }
      setVehicleList(updatedArray);
    } catch (error) {
      console.log("error in fetching the vehicle list");
      setVehicleList([]);
    }
  };

  const getDateType = (reportType) => {
    switch (reportType) {
      case "24Hours":
        setDateType("24Hours");
        break;
      case "Monthly":
        setDateType("Monthly");
        break;
      default:
        setDateType("Range");
        break;
    }
  };

  const getUpdatedReportType = (selectedId) => {
    console.log("selectedID in report type ,", selectedId);
    setReportTypeStr(selectedId);
    setIsReportSelected(true);
  };

  const getUpdatedDate = (dateRanges) => {
    console.log("range ", dateRanges);
    let startDate = moment(dateRanges[0]).format("DD/MM/YYYY");
    let endDate = moment(dateRanges[1]).format("DD/MM/YYYY");
    formik.setFieldValue("startDate", startDate);
    formik.setFieldValue("endDate", endDate);

    console.log("startDate ", startDate);
    console.log("endDawte ", endDate);
  };

  const handleDownloadReport = async () => {
    let postData = {
      vehicleNo: formik.values.vehicleNo.name,
      reportType: reportTypeStr,
    };
    if (formik.values.reportType._id === "24Hours") {
      console.log("formik.values.singleDate ", formik.values.singleDate);
      postData.date = moment(formik.values.singleDate).format("DD/MM/YYYY");
    } else if (formik.values.reportType._id === "Monthly") {
      postData.date = moment(formik.values.monthlyDate).format("MM/YYYY");
    } else {
      postData.startDate = formik.values.startDate;
      postData.endDate = formik.values.endDate;
    }
    const downloadReport = await post("/superadmin/generate-report", postData);
    console.log("downlaod ", downloadReport);
    if (downloadReport.status === 200) {
      var link = document.createElement("a");
      link.href = `${downloadReport.data.reportLink}`;
      link.download = `${downloadReport.data.VehicleNo}_${downloadReport.data.id}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      SweetAlert("Report downloaded successfully", false);
    } else {
      SweetAlert(downloadReport.message, true);
      history.push("/reports");
    }
  };

  useEffect(() => {
    getEmployeeList();
  }, []);

  useEffect(() => {
    console.log("we are calling ", formik.values.empId.empId);
    getClientListPerEmployee(formik.values.empId.empId);
  }, [formik.values.empId.empId]);

  useEffect(() => {
    console.log("we are calling the vehicleList ", formik.values.clientId);
    getVehicleListPerClient(formik.values.clientId._id);
  }, [formik.values.clientId._id]);

  useEffect(() => {
    console.log("we are callign formninkd ");
    getDateType(formik.values.reportType._id);
  }, [formik.values.reportType]);

  return (
    <>
      <Card>
        <CardHeader title={"Reports"}>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToDashboard}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="row">
            <div className="col-lg-4">
              <SelectInputComponent
                data={employeeData}
                label={"Select Employee"}
                name={"empId"}
                value={formik.values.empId}
                formikFunc={formik}
              />
            </div>
            <div className="col-lg-4">
              <SelectInputComponent
                data={clientList}
                label={"Select Client"}
                name={"clientId"}
                value={formik.values.clientId}
                formikFunc={formik}
              />
            </div>
            <div className="col-lg-4">
              <SelectInputComponent
                data={vehicleList}
                label={"Select Vehicle"}
                name={"vehicleNo"}
                value={formik.values.vehicleNo}
                formikFunc={formik}
              />
            </div>
            {isVehicleSelected ? (
              <>
                <div className="col-lg-4">
                  <SelectInputComponent
                    data={reportTypes}
                    label={"Select Report Type"}
                    name={"reportType"}
                    value={formik.values.reportType}
                    formikFunc={formik}
                    testFunc={getUpdatedReportType}
                  />
                </div>
              </>
            ) : null}
            {isReportSelected ? (
              <>
                <div className="col-lg-4">
                  {dateType === "24Hours" ? (
                    <TextInputComponent
                      className={"set_placeholder_font date-picker-report"}
                      name="singleDate"
                      inputType={"date"}
                      value={formik.values.singleDate}
                      onChange={(e) =>
                        formik.setFieldValue("singleDate", e.target.value)
                      }
                      max={get18YearOld()}
                    />
                  ) : dateType === "Monthly" ? (
                    <TextInputComponent
                      name="monthlyDate"
                      inputType={"month"}
                      value={formik.values.monthlyDate}
                      onChange={(e) => getMonthlyDate(e.target.value)}
                      max={getMonth()}
                    />
                  ) : (
                    <div style={{ marginTop: "3.25rem" }}>
                      <CustomDateRangePicker
                        getUpdatedDateRange={getUpdatedDate}
                        isFullWidth={true}
                      />
                    </div>
                  )}
                </div>
                <div className="col-lg-4">
                  <ButtonComponent
                    placeholder={"Download Report"}
                    handleClick={handleDownloadReport}
                    isDisabled={
                      !(
                        isReportSelected &&
                        dateType &&
                        (formik.values.singleDate ||
                          formik.values.startDate ||
                          formik.values.endDate ||
                          formik.values.monthlyDate)
                      )
                    }
                  />
                </div>
              </>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default ReportPage;
