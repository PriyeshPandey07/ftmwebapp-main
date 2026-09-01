import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { ReactSelect } from "../../../_metronic/_partials/controls";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { SweetAlert } from "../../utils/helper";
import { put, get } from "../../components/api";
import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom"; // Import Redirect from react-router-dom

// Validation schema
const companySchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  ownerName: Yup.string().required("Owner name is required"),
  mobileNo: Yup.string()
    .matches(/^[0-9]+$/, "Mobile number must contain only numbers")
    .min(10, "Mobile number have 10 digits")
    .max(10, "Mobile number cannot exceed 10 digits")
    .required("Mobile number is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(20, "Maximum 20 characters allowed")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
    ),
  address: Yup.string().required("Address is required"),
  state: Yup.string()
    .nullable()
    .required("State is required"),
  city: Yup.string()
    .nullable()
    .required("City is required"),
  status: Yup.string().required("Status is required"),
  gender: Yup.string().required("Gender is required"),
  adharPhoto: Yup.mixed().required("Adhar card is required"),
  panPhoto: Yup.mixed().required("Pan card is required"),
  adharPhotoPreview: Yup.mixed()
    .required("Adhar card is required")
    .nullable(),
  panPhotoPreview: Yup.mixed()
    .required("Pan card is required")
    .nullable(),
});

function CompanyEditPage({ history }) {
  // Define your initial values
  let { id } = useParams();

  const fileInputRef = useRef(null);
  const fileInputPanRef = useRef(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [cities, setCities] = useState([]);

  const location = useLocation();

  // Get the user role from Redux store
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const copmanyData = {
    name: "",
    ownerName: "",
    email: "",
    password: "",
    mobileNo: "",
    address: "",
    state: "",
    city: "",
    status: "",
    adharPhoto: "",
    adharPhotoPreview: "",
    panPhoto: "",
    panPhotoPreview: "",
    gender: "",
  };

  useEffect(() => {
    (async () => {
      if (selectedState !== "") {
        const response = await getCities(selectedState);
        console.log("response", response);
        if (response.status === 200) {
          setCities(response.data);
        }
      } else {
        const response = await get(`/states`);
        if (response.status === 200) {
          setStates(response.data);
          await getCompanyData(response.data);
        }
      }
    })();
  }, [selectedState]);

  // check is file object or not
  function isObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
  }

  const getCompanyData = async (statesData) => {
    if (id !== undefined && id !== null && id !== "") {
      const response = await get(`/superadmin/company/${id}`);
      if (response.status === 200) {
        let tempData = { ...response.data };
        const citiesData = await getCities(tempData.state);
        const selectedState =
          statesData.length > 0
            ? statesData.find((state) => state._id === tempData.state)
            : null;
        const selectedCity =
          citiesData.data.length > 0
            ? citiesData.data.find((city) => city._id === tempData.city)
            : null;
        tempData.adharPhotoPreview = response.data.adharPhoto;
        tempData.panPhotoPreview = response.data.panPhoto;
        tempData.state = selectedState;
        tempData.city = selectedCity;
        formik.setValues({
          ...tempData,
        });
      }
    }
  };

  const getCities = async (id) => {
    const response = await get(`/cities/${id}`);
    return response;
  };

  const selectState = (name, value) => {
    formik.setFieldValue(name, value);
    setSelectedState(value._id);
  };

  // file upload
  const handleFileUpload = (event, name) => {
    event.preventDefault();
    var fileType = event.target.files[0].name
      .split(".")
      .pop()
      .toLowerCase();
    if (event.target.files.length > 0) {
      if (fileType === "png" || fileType === "jpg" || fileType === "jpeg") {
        if (name === "adharPhoto") {
          formik.setFieldValue(name, event.currentTarget.files[0]);
          formik.setFieldValue("", event.currentTarget.files[0]);
          formik.setFieldValue(
            "adharPhotoPreview",
            URL.createObjectURL(event.currentTarget.files[0])
          );
        } else {
          formik.setFieldValue(name, event.currentTarget.files[0]);
          formik.setFieldValue(
            "panPhotoPreview",
            URL.createObjectURL(event.currentTarget.files[0])
          );
        }
      }
    }
  };

  const handleGenderRadioButtons = (e) => {
    formik.setFieldValue("gender", e.target.value);
  };

  const formik = useFormik({
    initialValues: copmanyData,
    validationSchema: companySchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let form_data = new FormData();
        form_data.append("name", values.name);
        form_data.append("ownerName", values.ownerName);
        form_data.append("email", values.email);
        if (
          values.password !== undefined &&
          values.password !== null &&
          values.password !== ""
        ) {
          form_data.append("password", values.password);
        }
        form_data.append("mobileNo", values.mobileNo);
        form_data.append("address", values.address);
        form_data.append("state", values.state._id);
        form_data.append("city", values.city._id);
        form_data.append("status", values.status);
        form_data.append("gender", values.gender);
        if (isObject(values.adharPhoto)) {
          form_data.append("adharPhoto", values.adharPhoto);
        }
        if (isObject(values.panPhoto)) {
          form_data.append("panPhoto", values.panPhoto);
        }
        console.log("form_data", form_data);
        const response = await put(`/superadmin/company/edit/${id}`, form_data);
        if (response.status === 200) {
          SweetAlert(response.message, false);
          setSubmitting(false);
          setTimeout(() => {
            history.push("/fleet-owners");
          }, 2000);
        } else {
          setSubmitting(false);
          SweetAlert(response.message, true);
        }
      } catch (ex) {
        setSubmitting(false);
        console.error(ex);
      } finally {
        setSubmitting(true);
      }
    },
  });

  // Define your form submission handler
  const btnRef = useRef();
  const handleSubmitData = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  // back to listing page
  const backToCompanyList = () => {
    history.push(`/fleet-owners`);
  };

  if (
    userRole === "admin" &&
    window.location.pathname.includes("/fleet-owner/edit")
  ) {
    return <Redirect to="/fleet-owners" />;
  }

  return (
    <Card>
      <CardHeader title={`Edit Fleet Owner`}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToCompanyList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={handleSubmitData}
            disabled={formik.isSubmitting}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <form
          id="kt_modal_add_task_form"
          className="form"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="row">
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Name</label>
              <input
                placeholder="Company Name"
                {...formik.getFieldProps("name")}
                type="text"
                name="name"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.name && formik.errors.name,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.name && formik.errors.name && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.name}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Owner Name</label>
              <input
                placeholder="Owner Name"
                {...formik.getFieldProps("ownerName")}
                type="text"
                name="ownerName"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.ownerName && formik.errors.ownerName,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.ownerName && formik.errors.ownerName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.ownerName}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Email</label>
              <input
                placeholder="Email"
                {...formik.getFieldProps("email")}
                type="email"
                name="email"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.email && formik.errors.email,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.email}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Password</label>
              <input
                placeholder="Password"
                {...formik.getFieldProps("password")}
                type="password"
                name="password"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.password && formik.errors.password,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.password}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Mobile No</label>
              <input
                placeholder="Mobile No"
                {...formik.getFieldProps("mobileNo")}
                type="text"
                name="mobileNo"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.mobileNo && formik.errors.mobileNo,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.mobileNo && formik.errors.mobileNo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.mobileNo}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Address</label>
              <input
                placeholder="Address"
                {...formik.getFieldProps("address")}
                type="text"
                name="address"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.address && formik.errors.address,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.address && formik.errors.address && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.address}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-4 mb-5">
              <label>States</label>
              <ReactSelect
                name="state"
                value={formik.values.state}
                options={states}
                handleOnChange={selectState}
                isSearchable={true}
                isLoading={false}
                noOptionsMessage="states not availables."
                placeholder="Select State"
              />
              {formik.touched.state && formik.errors.state && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span>{formik.errors.state}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-4 mb-5">
              <label>Cities</label>
              <ReactSelect
                name="city"
                value={formik.values.city}
                options={cities}
                handleOnChange={formik.setFieldValue}
                isSearchable={true}
                isLoading={false}
                noOptionsMessage="Cities not availables."
                placeholder="Select City"
              />
              {formik.touched.city && formik.errors.city && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span>{formik.errors.city}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-4 mb-5">
              <label>Status</label>
              <select
                {...formik.getFieldProps("status")}
                name="status"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.status && formik.errors.status,
                  }
                )}
              >
                <option value="">Select Status</option>
                <option value="Pending">PENDING</option>
                <option value="Approved">APPROVED</option>
                <option value="Rejected">REJECTED</option>
              </select>
              {formik.touched.status && formik.errors.status && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.status}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-5">
              <label className="required fw-bold fs-6 mb-2">Gender</label>
              <div
                style={{ width: "60%", display: "flex", alignItems: "center" }}
              >
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  onChange={(e) => handleGenderRadioButtons(e)}
                  checked={"Male" === formik.values.gender}
                />
                <label
                  for="male"
                  style={{
                    paddingRight: "1.5rem",
                    paddingLeft: "0.25rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  Male
                </label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  onChange={(e) => handleGenderRadioButtons(e)}
                  checked={"Female" === formik.values.gender}
                />
                <label
                  for="female"
                  style={{
                    paddingRight: "1.5rem",
                    paddingLeft: "0.25rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  Female
                </label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="Other"
                  style={{ width: "1.25rem", height: "1.25rem" }}
                  onChange={(e) => handleGenderRadioButtons(e)}
                  checked={"Other" === formik.values.gender}
                />
                <label
                  for="other"
                  style={{
                    paddingRight: "1.5rem",
                    paddingLeft: "0.25rem",
                    paddingTop: "0.5rem",
                  }}
                >
                  Other
                </label>
              </div>
              {formik.touched.gender && formik.errors.gender && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.gender}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-5">
              <label>Upload Adhar Card</label>
              <br />
              {formik.values.adharPhoto && (
                <div className="d-flex flex-column align-items-start">
                  <img
                    src={formik.values.adharPhotoPreview}
                    alt="Uploaded"
                    height="150px"
                    width="auto"
                  />
                </div>
              )}
              <div className="mt-3">
                <button
                  type="button"
                  className={`btn btn-primary font-weight-bold mr-2`}
                  onClick={() => fileInputRef.current.click()}
                >
                  {formik.values.adharPhoto ? "Change" : "Upload"}
                  <input
                    name="adharPhoto"
                    accept="image/*"
                    id={`upload-image`}
                    type="file"
                    ref={fileInputRef}
                    hidden
                    onChange={(event) => handleFileUpload(event, "adharPhoto")}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                </button>
                {formik.values.adharPhoto && (
                  <button
                    type="button"
                    className={`btn btn-danger font-weight-bold mr-2`}
                    onClick={() => {
                      formik.setFieldValue("adharPhoto", null);
                      formik.setFieldValue("adharPhotoPreview", null);
                    }}
                  >
                    Remove
                  </button>
                )}
                {formik.touched.adharPhoto && formik.errors.adharPhotoPreview && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span>{formik.errors.adharPhotoPreview}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-6 mb-5">
              <label>Upload Pan Card</label>
              <br />
              {formik.values.panPhoto && (
                <div className="d-flex flex-column align-items-start">
                  <img
                    src={formik.values.panPhotoPreview}
                    alt="Uploaded"
                    height="150px"
                    width="auto"
                  />
                </div>
              )}
              <div className="mt-3">
                <button
                  type="button"
                  className={`btn btn-primary font-weight-bold mr-2`}
                  onClick={() => fileInputPanRef.current.click()}
                >
                  {formik.values.panPhoto ? "Change" : "Upload"}
                  <input
                    name="panPhoto"
                    accept="image/*"
                    id={`upload-pan-image`}
                    type="file"
                    ref={fileInputPanRef}
                    hidden
                    onChange={(event) => handleFileUpload(event, "panPhoto")}
                    onClick={(e) => {
                      e.target.value = null;
                    }}
                  />
                </button>
                {formik.values.panPhoto && (
                  <button
                    type="button"
                    className={`btn btn-danger font-weight-bold mr-2`}
                    onClick={() => {
                      formik.setFieldValue("panPhoto", null);
                      formik.setFieldValue("panPhotoPreview", null);
                    }}
                  >
                    Remove
                  </button>
                )}
                {formik.touched.panPhoto && formik.errors.panPhotoPreview && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span>{formik.errors.panPhotoPreview}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            style={{ display: "none" }}
            ref={btnRef}
            disabled={formik.isSubmitting}
          ></button>
        </form>
      </CardBody>
    </Card>
  );
}

export default CompanyEditPage;
