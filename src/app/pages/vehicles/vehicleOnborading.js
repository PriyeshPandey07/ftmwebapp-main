import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SelectInputComponent from "../../components/SelectInputComponent";
import { get, post } from "../../components/api";
import { useFormik } from "formik";
import * as yup from "yup";
import SelectFileComponent from "../../components/SelectFileComponent";
import { isObject } from "lodash";
import { SweetAlert } from "../../utils/helper";
import moment from "moment";

const initialValuesClientOnboarding = {
  empId: "",
  clientList: {
    _id: "",
    name: "Select Client",
  },
  brandModel: {
    _id: "",
    name: "Select Brand",
  },
  truckModel: {
    _id: "",
    name: "Select Model",
  },
  axelModel: {
    _id: "",
    name: "Select Axel",
  },
  tyreModel: {
    _id: "",
    name: "Select Tyre",
  },
  vehicleList: {
    _id: "",
    name: "Select Vehicle",
  },
  deviceOption: {
    _id: "GPS",
    name: "GPS",
  },
  calibrationData: null,
  deviceName: null,
  planList: {
    _id: "",
    name: "Select Plan",
  },
  imeiNo: "",
  planType: "",
  paymentType: "",
  vehicleNo: "",
  engineType: "",
  totalAmount: "",
  imeiNo: "",
  planStartingDate: "",
  planEndingDate: "",
  vehiclePhoto: File,
  RCPhoto: File,
};

function VehicleOnboarding({ history }) {
  const [deviceId, setDeviceId] = useState("");
  const [scrollable, setScrollable] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [stateId, setStateId] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [truckList, setTruckList] = useState([]);
  const [planOptions, setPlanOptions] = useState([]);
  const [vehicleOnboardingList, setVehicleOnboardingList] = useState([]);
  const [isFuel, setIsFuel] = useState(false);
  const validFileExtensions = ["jpg", "jpeg", "png"];

  const getClientList = async (empId) => {
    try {
      let clientList = await post("/get-companies-by-empId", { empId: empId });
      let data = clientList.data;
      setClientList(data);
    } catch (error) {
      setClientList([]);
    }
  };

  const paymentTypeOptions = [
    {
      _id: "online",
      name: "Online",
    },
    {
      _id: "offline",
      name: "Offline",
    },
  ];
  const deviceNameOption = [
    {
      _id: "Omnicomm",
      name: "Omnicomm",
    },
    {
      _id: "Escort",
      name: "Escort",
    },
  ];
  const deviceOption = [
    {
      _id: "GPS",
      name: "GPS",
    },
    {
      _id: "GPS_FUEL",
      name: "GPS_FUEL",
    },
  ];
  const axelOption = [
    { _id: 2, name: 2 },
    { _id: 3, name: 3 },
    { _id: 4, name: 4 },
    { _id: 5, name: 5 },
    { _id: 6, name: 6 },
    { _id: 7, name: 7 },
  ];
  const tyreOption = [
    {
      _id: 4,
      name: 4,
    },
    {
      _id: 6,
      name: 6,
    },
    {
      _id: 8,
      name: 8,
    },
    {
      _id: 10,
      name: 10,
    },
    {
      _id: 12,
      name: 12,
    },
    {
      _id: 14,
      name: 14,
    },
    {
      _id: 16,
      name: 16,
    },
    {
      _id: 18,
      name: 18,
    },
    {
      _id: 22,
      name: 22,
    },
  ];
  const getVehicleOnboardingList = async (clientId) => {
    try {
      const vehicleList = await post("/vehicle-onboarding-list", {
        clientId: clientId,
      });
      if (vehicleList.data.length > 0) {
        let vehicleNoList = [];

        for (let vehicleNo of vehicleList.data) {
          vehicleNoList.push({
            _id: vehicleNo,
            name: vehicleNo,
          });
        }

        setVehicleOnboardingList(vehicleNoList);
      }
    } catch (error) {
      console.log("error in fetching vehicle onboarding details");
      setVehicleOnboardingList([]);
    }
  };

  const getBrandList = async () => {
    try {
      let brandList = await get("/truck-brand-list");
      setBrandList(brandList.data);
    } catch (error) {
      setBrandList([]);
    }
  };

  const getTruckList = async (id) => {
    try {
      let truckList = await get(`/truck-models-list-brand/${id}`);
      setTruckList(truckList.data);
    } catch (error) {
      setTruckList([]);
    }
  };

  const getPlanList = async (planType) => {
    try {
      let planList = await post("/get-plan-list-for-onboarding", {
        planType: planType,
      });
      setPlanOptions(planList.data);
    } catch (error) {
      setPlanOptions([]);
    }
  };

  useEffect(() => {
    async function getStateList() {
      try {
        let stateList = await get(`/states`);
        setStateList(stateList.data);
      } catch (error) {
        setStateList([]);
      }
    }
    getStateList();
    getBrandList();
    getPlanList(initialValuesClientOnboarding?.deviceOption._id);
    const screenHeight = window.innerHeight;
    const contentHeight = document.querySelector(".scrollable-content")
      .offsetHeight;
    if (contentHeight > screenHeight) {
      setScrollable(true);
    } else {
      setScrollable(false);
    }
  }, []);

  useEffect(() => {
    async function getCityListPerState(id) {
      try {
        let cityList = await get(`/cities/${id}`);
        setCityList(cityList.data);
      } catch (error) {
        setCityList([]);
      }
    }
    if (stateId !== null) {
      getCityListPerState(stateId);
    }
  }, [stateId]);

  const ClientOnboardingSchema = yup.object().shape({
    empId: yup
      .string()
      .min(3, "Minimum 3 symbols")
      .required("Employee Id is required"),
    clientList: yup.object().shape({
      _id: yup.string().required("Client is required"),
      name: yup.string().required("Client name is required"),
    }),
    brandModel: yup.object().shape({
      _id: yup.string().required("brandModel is required"),
      name: yup.string().required("brandModel is required"),
    }),
    truckModel: yup.object().shape({
      _id: yup.string().required("TruckModel is required"),
      name: yup.string().required("TruckModel is required"),
    }),
    axelModel: yup.object().shape({
      _id: yup.string().required("Axel is required"),
      name: yup.string().required("Axel is required"),
    }),
    tyreModel: yup.object().shape({
      _id: yup.string().required("tyre is required"),
      name: yup.string().required("tyre is required"),
    }),
    vehicleList: yup.object().shape({
      _id: yup.string(),
      name: yup.string(),
    }),
    // deviceOption: yup.string().oneOf(["GPS", "GPS_FUEL"], "Invalid option").required("GPS Option is required"),
    calibrationData: yup.mixed().when("deviceOption", {
      is: "GPS_FUEL",
      then: yup
        .mixed()
        .required("Calibration Data is required")
        .test("fileFormat", "Only Excel files are allowed", (value) => {
          if (value) {
            const fileType = value.name.split(".").pop();
            return (
              fileType === "xls" || fileType === "xlsx" || fileType === "csv"
            );
          }
          return false;
        })
        .test("fileSize", "File size must be less than 10MB", (value) => {
          if (value) {
            return value.size <= 10485760; // 10MB
          }
          return true;
        }),
      otherwise: yup.mixed().notRequired(),
    }),
    deviceName: yup.mixed().when("deviceOption", {
      is: "GPS_FUEL",
      then: yup
        .string()
        .oneOf(["Omnicomm", "Escort"], "Invalid device name")
        .required("Device name is required"),
      otherwise: yup.string().nullable(),
    }),
    planList: yup.object().shape({
      _id: yup.string().required("plan is required"),
      name: yup.string().required("plan is required"),
    }),
    imeiNo: yup.string().required("imeiNo is required"),
    paymentType: yup.string(),
    planType: yup.string(),
    engineType: yup.string(),
    planStartingDate: yup.string(),
    planEndingDate: yup.string(),
    totalAmount: yup.string().required("totalAmount is required"),
    vehicleNo: yup.string().required("vehicleNo is required"),
    vehiclePhoto: yup
      .mixed()
      .required("Vehicle Photo is required")
      .test("fileFormat", "Only image type are allowed", (value) => {
        if (value) {
          return validFileExtensions.includes(value.name.split(".").pop());
        }
        return true;
      })
      .test("fileSize", "File size must be less than 10MB", (value) => {
        if (value) {
          return value.size <= 10485760;
        }
        return true;
      }),
    RCPhoto: yup
      .mixed()
      .required("RC photo is required")
      .test("fileFormat", "Only image type are allowed", (value) => {
        if (value) {
          return validFileExtensions.includes(value.name.split(".").pop());
        }
        return true;
      })
      .test("fileSize", "File size must be less than 10MB", (value) => {
        if (value) {
          return value.size <= 10485760;
        }
        return true;
      }),
  });

  const formik = useFormik({
    initialValues: initialValuesClientOnboarding,
    validationSchema: ClientOnboardingSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      console.log(values);
      setLoading(true);
      setSubmitting(true);
      let apiUrl;
      // return false;
      const clientFormData = new FormData();
      if (formik.values.paymentType._id == "offline") {
        clientFormData.append("empId", values.empId);
        clientFormData.append("clientId", values.clientList._id);
        clientFormData.append("brandModel", values.brandModel._id);
        clientFormData.append("truckModel", values.truckModel._id);
        clientFormData.append("axelModel", values.axelModel.name);
        clientFormData.append("tyreModel", values.tyreModel.name);
        clientFormData.append("vehicleNo", values.vehicleNo);
        clientFormData.append("ImeiNo", values.imeiNo);
        clientFormData.append("isFuel", isFuel);
        console.log(clientFormData);
        if (values.calibrationData) {
          clientFormData.append("calibrationData", values.calibrationData);
        }
        if (values.deviceName) {
          clientFormData.append("deviceName", values.deviceName._id);
        }
        clientFormData.append("planId", values.planList._id);
        apiUrl = "/vehicle-onboarding-offline-payment";
      }

      if (formik.values.paymentType._id == "online") {
        clientFormData.append("empId", values.empId);
        clientFormData.append("client", values.clientList._id);
        clientFormData.append("brandModel", values.brandModel._id);
        clientFormData.append("truckModel", values.truckModel._id);
        clientFormData.append("axelModel", values.axelModel.name);
        clientFormData.append("tyreModel", values.tyreModel.name);
        clientFormData.append("vehicleNo", values.vehicleList._id);
        clientFormData.append("isFuel", isFuel);
        if (values.calibrationData) {
          clientFormData.append("calibrationData", values.calibrationData);
        }
        if (values.deviceName) {
          clientFormData.append("deviceName", values.deviceName._id);
        }
        clientFormData.append("device", deviceId);
        apiUrl = "/vehicle-onboarding";
      }
      if (isObject(values.vehiclePhoto)) {
        clientFormData.append("vehiclePhoto", values.vehiclePhoto);
      }
      if (isObject(values.RCPhoto)) {
        clientFormData.append("RCPhoto", values.RCPhoto);
      }
      const registerVehicle = await post(apiUrl, clientFormData);
      if (registerVehicle.status === 200) {
        setSubmitting(false);
        resetForm();
        SweetAlert(registerVehicle.message, false);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        SweetAlert(registerVehicle.message, true);
        setStateId(null);
        setCityList(null);
        setSubmitting(false);
      }
    },
  });

  const selectOnchange = (event, fieldname) => {
    if (fieldname === "deviceOption") {
      setIsFuel(event._id === "GPS_FUEL");
      if (event._id) {
        getPlanList(event._id);
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    formik.setFieldValue("calibrationData", file);
  };

  const getVehicleSusbscriptionDetails = async (vehicleNo) => {
    try {
      const getDetails = await post("/vehicle-subscription-details", {
        vehicleNo: vehicleNo,
      });
      if (getDetails.status == 200) {
        formik.setFieldValue("planType", getDetails.data[0].planDetails.type);
        formik.setFieldValue("imeiNo", getDetails.data[0].deviceDetail.ImeiNo);
        formik.setFieldValue(
          "planStartingDate",
          moment(getDetails.data[0].startDate).format("DD/MM/YYYY hh:mm A")
        );
        formik.setFieldValue(
          "planEndingDate",
          moment(getDetails.data[0].endDate).format("DD/MM/YYYY hh:mm A")
        );
        let engineTypeResponse = getDetails.data[0].orderDetails.engineType;
        setDeviceId(getDetails?.data[0]?.assignDeviceId);
        if (engineTypeResponse.length == 0) {
          setIsFuel(false);
        } else {
          formik.setFieldValue("engineType", engineTypeResponse);
          setIsFuel(true);
        }
      } else {
        console.log("some error occured");
      }
    } catch (error) {
      console.log("error in getting vehicle subscription details");
    }
  };

  const getPlanDetails = async (planId) => {
    try {
      const getDetails = await post("/plan-details", { planId: planId });
      if (getDetails.status == 200) {
        let calculateGstPrice = (18 * getDetails?.data?.discountedPrice) / 100;
        let totalPriceWithGst =
          parseInt(getDetails?.data?.discountedPrice) +
          parseInt(calculateGstPrice);
        formik.setFieldValue("totalAmount", totalPriceWithGst);
      } else {
        console.log("some error occured");
      }
    } catch (error) {
      console.log("error in getting vehicle subscription details");
    }
  };

  useEffect(() => {
    if (formik?.values?.empId || formik?.initialValues?.empId) {
      getClientList(formik.values.empId);
    }
  }, [formik.values.empId || formik.initialValues.empId]);

  useEffect(() => {
    if (
      formik?.values?.clientList?._id ||
      formik?.initialValues?.clientList?._id
    ) {
      getVehicleOnboardingList(formik.values.clientList._id);
    }
  }, [formik.values.clientList._id || formik.initialValues.clientList._id]);

  useEffect(() => {
    if (
      formik?.values?.vehicleList?._id ||
      formik?.initialValues?.vehicleList?._id
    ) {
      getVehicleSusbscriptionDetails(formik.values.vehicleList._id);
    }
  }, [formik.values.vehicleList._id || formik.initialValues.vehicleList._id]);

  useEffect(() => {
    if (formik?.values?.planList?._id || formik?.values?.planList?._id) {
      getPlanDetails(formik.values.planList._id);
    }
  }, [formik.values.planList._id || formik.values.planList._id]);

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const getUpdateScrollable = () => {
    setTimeout(() => {
      const screenHeight = window.innerHeight;
      const contentHeight = document.querySelector(".scrollable-content")
        .offsetHeight;
      if (contentHeight > screenHeight) {
        setScrollable(true);
      } else {
        setScrollable(false);
      }
    }, 500);
  };
  const handleSelectBrand = (selectedBrand, fieldName) => {
    formik.setFieldValue(fieldName, selectedBrand);
    if (selectedBrand?._id) {
      getTruckList(selectedBrand._id);
    }
    formik.setFieldValue("truckModel", {
      _id: "",
      name: "Select Model",
    });
  };
  {
    console.log(formik.errors);
  }

  console.log(">>>", clientList);
  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
        id="kt_login"
      >
        <div
          className="left login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
          style={{
            flex: "0 0 50%",
            backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-5.jpg")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100vh",
          }}
        >
          <div className="d-flex flex-row-fluid flex-column justify-content-between">
            <Link to="/" className="flex-column-auto mt-5">
              <img
                alt="Logo"
                className="max-h-70px"
                src={toAbsoluteUrl("/media/logos/logo-light-copy.png")}
              />
            </Link>
            <div className="flex-column-fluid d-flex flex-column justify-content-center">
              <h3 className="font-size-h1 mb-5 text-white">
                Welcome to FleetStakes!
              </h3>
              <p className="font-weight-lighter text-white opacity-80">
                The ultimate Bootstrap & React 16 admin theme framework for next
                generation web apps.
              </p>
            </div>
          </div>
        </div>
        <div
          className="right"
          style={{ overflowY: scrollable ? "auto" : "hidden" }}
        >
          <div className="scrollable-content login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
            <div className="d-flex flex-column-fluid flex-center">
              <div
                className="login-form login-signin"
                style={{ display: "block" }}
              >
                <div className="text-center mb-5 mb-lg-10">
                  <h3 className="font-size-h1">New Vehicle Onboarding</h3>
                  <p className="text-muted font-weight-bold">
                    Enter your details to create your account
                  </p>
                </div>
                <form
                  id="kt_login_signin_form"
                  className="form fv-plugins-bootstrap fv-plugins-framework animated animate__animated animate__backInUp client_onboarding_page"
                  onSubmit={formik.handleSubmit}
                >
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="empId">Employee ID</label>
                    <input
                      placeholder="Employee ID"
                      type="text"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "empId"
                      )}`}
                      name="empId"
                      {...formik.getFieldProps("empId")}
                    />
                    {formik.touched.empId && formik.errors.empId ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.empId}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Cilent</label>
                    <SelectInputComponent
                      data={clientList}
                      isRequired={true}
                      label="Select Client"
                      formikFunc={formik}
                      value={formik.values.clientList}
                      name="clientList"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("clientList")}`}
                    />
                    {formik.touched.clientList && formik.errors.clientList ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.clientList._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Truck Brand</label>
                    <SelectInputComponent
                      data={brandList}
                      isRequired={true}
                      label="Select truck brand"
                      formikFunc={formik}
                      value={formik.values.brandModel}
                      name="brandModel"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("brandModel")}`}
                      testFunc={handleSelectBrand}
                    />
                    {formik.touched.brandModel && formik.errors.brandModel ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.brandModel._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Truck Model</label>
                    <SelectInputComponent
                      data={truckList}
                      isRequired={true}
                      label="Select truck model"
                      formikFunc={formik}
                      value={formik.values.truckModel}
                      name="truckModel"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("truckModel")}`}
                    />
                    {formik.touched.truckModel && formik.errors.truckModel ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.truckModel._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Truck Axel</label>
                    <SelectInputComponent
                      data={axelOption}
                      isRequired={true}
                      label="Select truck axel"
                      formikFunc={formik}
                      value={formik.values.axelModel}
                      name="axelModel"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("axelModel")}`}
                    />
                    {formik.touched.axelModel && formik.errors.axelModel ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.axelModel._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Tyres</label>
                    <SelectInputComponent
                      data={tyreOption}
                      isRequired={true}
                      label="Select tyres"
                      formikFunc={formik}
                      value={formik.values.tyreModel}
                      name="tyreModel"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("tyreModel")}`}
                    />
                    {formik.touched.tyreModel && formik.errors.tyreModel ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.tyreModel._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="deviceOption">Select Device Option</label>
                    <SelectInputComponent
                      data={deviceOption}
                      isRequired={true}
                      label="Select device type"
                      formikFunc={formik}
                      value={formik.values.deviceOption}
                      name="deviceOption"
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("deviceOption")}`}
                      selectOnchange={selectOnchange}
                    />
                    {formik.touched.deviceOption &&
                    formik.errors.deviceOption ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.deviceOption._id}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {formik.values.deviceOption._id === "GPS_FUEL" && (
                    <div className="form-group fv-plugins-icon-container">
                      <label htmlFor="calibrationData">
                        Calibration Data (Excel file only)
                      </label>
                      <input
                        type="file"
                        name="calibrationData"
                        accept=".xls,.xlsx,.csv"
                        onChange={handleFileChange}
                        onBlur={formik.handleBlur}
                        className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                          "calibrationData"
                        )}`}
                      />
                      {formik.touched.calibrationData &&
                      formik.errors.calibrationData ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.calibrationData}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  {formik.values.deviceOption._id === "GPS_FUEL" && (
                    <div className="form-group fv-plugins-icon-container">
                      <label htmlFor="deviceName">Select Device Name</label>
                      <SelectInputComponent
                        data={deviceNameOption}
                        isRequired={true}
                        label="Select device name"
                        formikFunc={formik}
                        value={formik.values.deviceName}
                        name="deviceName"
                        testFunc={getUpdateScrollable}
                        handleBlur={formik.handleBlur}
                        className={`${getInputClasses("deviceName")}`}
                        selectOnchange={selectOnchange}
                      />
                      {formik.touched.deviceName && formik.errors.deviceName ? (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            {formik.errors.deviceName}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div className="form-group fv-plugins-icon-container">
                    <label htmlFor="clientList">Select Payment Type</label>
                    <SelectInputComponent
                      data={paymentTypeOptions}
                      isRequired={true}
                      label="Select payment type"
                      formikFunc={formik}
                      value={formik.values.paymentType}
                      name="paymentType"
                      testFunc={getUpdateScrollable}
                      handleBlur={formik.handleBlur}
                      className={`${getInputClasses("paymentType")}`}
                      selectOnchange={selectOnchange}
                    />
                    {formik.touched.paymentType && formik.errors.paymentType ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.paymentType}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  {formik?.values?.paymentType?._id == "online" ? (
                    <>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="clientList">Select Vehicle</label>
                        <SelectInputComponent
                          data={vehicleOnboardingList}
                          isRequired={true}
                          label="Select vehicle model"
                          formikFunc={formik}
                          value={formik.values.vehicleList}
                          name="vehicleList"
                          handleBlur={formik.handleBlur}
                          className={`${getInputClasses("vehicleList")}`}
                        />
                        {formik.touched.vehicleList &&
                        formik.errors.vehicleList ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.vehicleList}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Plan type</label>
                        <input
                          placeholder="Plan type"
                          type="text"
                          disabled={true}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "planType"
                          )}`}
                          name="planType"
                          {...formik.getFieldProps("planType")}
                        />
                        {formik.touched.planType && formik.errors.planType ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.planType}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Plan Starting Date</label>
                        <input
                          placeholder="Start Date"
                          type="text"
                          disabled={true}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "planStartingDate"
                          )}`}
                          name="planStartingDate"
                          {...formik.getFieldProps("planStartingDate")}
                        />
                        {formik.touched.planStartingDate &&
                        formik.errors.planStartingDate ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.planStartingDate}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Plan Ending Date</label>
                        <input
                          placeholder="End Date"
                          type="text"
                          disabled={true}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "planEndingDate"
                          )}`}
                          name="planEndingDate"
                          {...formik.getFieldProps("planEndingDate")}
                        />
                        {formik.touched.planEndingDate &&
                        formik.errors.planEndingDate ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.planEndingDate}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Device IMEI</label>
                        <input
                          placeholder="IMEI No"
                          type="text"
                          disabled={true}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "imeiNo"
                          )}`}
                          name="imei"
                          {...formik.getFieldProps("imeiNo")}
                        />
                        {formik.touched.imeiNo && formik.errors.imeiNo ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.imeiNo}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  {formik?.values?.paymentType?._id == "offline" ? (
                    <>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="clientList">Select Plan</label>
                        <SelectInputComponent
                          data={planOptions}
                          isRequired={true}
                          label="Select Plans"
                          formikFunc={formik}
                          value={formik.values.planList}
                          name="planList"
                          handleBlur={formik.handleBlur}
                          className={`${getInputClasses("planList")}`}
                        />
                        {formik.touched.planList && formik.errors.planList ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.planList._id}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Total Amount To Be Paid</label>
                        <input
                          placeholder="Total Amount"
                          type="text"
                          disabled={true}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "totalAmount"
                          )}`}
                          name="totalAmount"
                          {...formik.getFieldProps("totalAmount")}
                        />
                        {formik.touched.totalAmount &&
                        formik.errors.totalAmount ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.totalAmount}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Enter Device IMEI No</label>
                        <input
                          placeholder="IMEI No"
                          type="text"
                          value={formik.values.imeiNo}
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "imeiNo"
                          )}`}
                          name="imeiNo"
                          {...formik.getFieldProps("imeiNo")}
                        />
                        {formik.touched.imeiNo && formik.errors.imeiNo ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.imeiNo}
                            </div>
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group fv-plugins-icon-container">
                        <label htmlFor="address">Enter Vehicle No</label>
                        <input
                          placeholder="Vehicle NO"
                          type="text"
                          className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                            "vehicleNo"
                          )}`}
                          name="vehicleNo"
                          {...formik.getFieldProps("vehicleNo")}
                        />
                        {formik.touched.vehicleNo && formik.errors.vehicleNo ? (
                          <div className="fv-plugins-message-container">
                            <div className="fv-help-block">
                              {formik.errors.vehicleNo}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                  <div className="form-group fv-plugins-icon-container">
                    <SelectFileComponent
                      label="Upload Vehicle Photo"
                      placeholder="Upload vehicle photo"
                      // isRequired={true}
                      formikFunc={formik}
                      name="vehiclePhoto"
                      handleBlur={formik.handleBlur}
                      acceptType="image/*"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "vehiclePhoto"
                      )}`}
                    />
                    {formik.touched.vehiclePhoto &&
                    formik.errors.vehiclePhoto ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.vehiclePhoto}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <SelectFileComponent
                      label="Upload RC"
                      placeholder="Upload RC"
                      // isRequired={true}
                      formikFunc={formik}
                      name="RCPhoto"
                      handleBlur={formik.handleBlur}
                      acceptType="image/*"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "RCPhoto"
                      )}`}
                    />
                    {formik.touched.RCPhoto && formik.errors.RCPhoto ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          {formik.errors.RCPhoto}
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group d-flex flex-wrap flex-center">
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className="btn btn-primary font-weight-bold px-9 py-4 my-3 mx-4"
                    >
                      <span>Submit</span>
                      {loading && (
                        <span className="ml-3 spinner spinner-white"></span>
                      )}
                    </button>

                    <Link to="/auth/login">
                      <button
                        type="button"
                        className="btn btn-light-primary font-weight-bold px-9 py-4 my-3 mx-4"
                      >
                        Cancel
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleOnboarding;
