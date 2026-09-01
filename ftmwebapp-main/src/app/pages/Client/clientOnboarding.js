import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import SelectInputComponent from "../../components/SelectInputComponent";
import ButtonComponent from "../../components/ButtonComponent";
import { get, post } from "../../components/api";
import { useFormik } from "formik";
import * as yup from "yup";
import SelectFileComponent from "../../components/SelectFileComponent";
import { isObject } from "lodash";
import { SweetAlert } from "../../utils/helper";

const initialValuesClientOnboarding = {
  empId: "",
  companyName: "",
  clientName: "",
  mobileNum: "",
  email: "",
  password: "",
  dateOfBirth: "",
  state: {
    _id: "",
    name: "Select State",
  },
  city: {
    _id: "",
    name: "Select City",
  },
  address: "",
  gender: "",
  // photo: File,
  aadharCard: File,
  panCard: File,
};

function ClientOnboarding({ history }) {
  const [scrollable, setScrollable] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [stateId, setStateId] = useState(null);
  const [cityList, setCityList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const MAX_FILE_SIZE = 10240000; //1000KB
  const validFileExtensions = ["jpg", "jpeg", "png"];

  const handleGenderRadioButtons = (e)=> {
    console.log('gender ', e.target.value);
    formik.setFieldValue('gender', e.target.value);
  }

  useEffect(() => {
    async function getStateList() {
      try {
        let stateList = await get(`/states`);
        setStateList(stateList.data);
      } catch (error) {
        console.log("error in fetching state");
        setStateList([]);
      }
    }
    getStateList();
    const screenHeight = window.innerHeight;
    console.log('screenHeight', screenHeight);
    const contentHeight = document.querySelector('.scrollable-content').offsetHeight;
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
        console.log("error in fetching the cities");
        setCityList([]);
      }
    }
    getCityListPerState(stateId);
  }, [stateId]);

  const getUpdatedStateId = (selectedId) => {
    console.log('selected Id ', selectedId);
    setStateId(selectedId);
  };

  const ClientOnboardingSchema = yup.object().shape({
    empId: yup
      .string()
      .min(3, "Minimum 3 symbols")
      .required("Employee Id is required"),
    companyName: yup
      .string()
      .min(3, "Minimum 3 symbols")
      .required("Company name is required"),
    clientName: yup
      .string()
      .min(3, "Minimum 3 symbols")
      .required("Client name is required"),
    mobileNum: yup
      .string()
      .min(10, "Mobile num should be of 10 digits")
      .max(10, "Mobile number should be of 10 digits")
      .required("Mobile number is required"),
    email: yup
      .string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Maximum 20 characters allowed")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
      ),
    gender: yup.string(),
    dateOfBirth: yup.string().required("Date of birth is required"),
    state: yup.object().shape({
      _id: yup.string(),
      name: yup.string(),
    }),
    city: yup.object().shape({
      _id: yup.string(),
      name: yup.string(),
    }),
    address: yup
      .string()
      .min(3, "Minimum 3 symbols")
      .required("Address is required"),
    aadharCard: yup
      .mixed()
      .required("Aadhar Card is required")
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
    panCard: yup
      .mixed()
      .required("Pan card is required")
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
      setLoading(true);
      setSubmitting(true);
      const clientFormData = new FormData();
      clientFormData.append("empId", values.empId);
      clientFormData.append("ownerName", values.clientName);
      clientFormData.append("name", values.companyName);
      clientFormData.append("mobileNo", values.mobileNum);
      clientFormData.append("email", values.email);
      clientFormData.append("password", values.password);
      clientFormData.append("dob", values.dateOfBirth);
      clientFormData.append("state", values.state._id);
      clientFormData.append("city", values.city._id);
      clientFormData.append("address", values.address);
      clientFormData.append('gender', values.gender);
      if (isObject(values.aadharCard)) {
        clientFormData.append("adharPhoto", values.aadharCard);
      }
      // if (isObject(values.photo)) {
      //   clientFormData.append("photo", values.photo);
      // }
      if (isObject(values.panCard)) {
        clientFormData.append("panPhoto", values.panCard);
      }

      const registerClient = await post("/client-onboarding", clientFormData);
      if (registerClient.status === 200) {
        setSubmitting(false);
        history.push("/vehicle-onboarding");
        SweetAlert(registerClient.message, false);
      } else {
        SweetAlert(registerClient.message, true);
        setStateId(null);
        setCityList(null);
        // resetForm();
        setSubmitting(false);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 2000);
      }
    },
  });

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }
    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }
    return "";
  };

  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="login login-1 login-signin-on d-flex flex-column flex-lg-row flex-row-fluid bg-white"
        id="kt_login"
      >
        <div className="left login-aside d-flex flex-row-auto bgi-size-cover bgi-no-repeat p-10 p-lg-10"
          style={{
            flex: '0 0 50%',
            backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-5.jpg")})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'
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
        <div className="right" style={{ overflowY: scrollable ? 'auto' : 'hidden' }}>
          <div className="scrollable-content login-content flex-row-fluid d-flex flex-column justify-content-center position-relative overflow-hidden p-7 mx-auto">
            <div className="d-flex flex-column-fluid flex-center">
              <div className="login-form login-signin" style={{ display: "block" }}>
                <div className="text-center mb-5 mb-lg-10">
                  <h3 className="font-size-h1">
                    New Client Onboarding
                  </h3>
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
                    <label for="empId">Employee ID</label>
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
                        <div className="fv-help-block">{formik.errors.empId}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="companyName">Company Name</label>
                    <input
                      placeholder="Company Name"
                      type="text"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "companyName"
                      )}`}
                      name="companyName"
                      {...formik.getFieldProps("companyName")}
                    />
                    {formik.touched.companyName && formik.errors.companyName ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.companyName}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="clientName">Client Name</label>
                    <input
                      placeholder="Client Name"
                      type="text"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "clientName"
                      )}`}
                      name="clientName"
                      {...formik.getFieldProps("clientName")}
                    />
                    {formik.touched.clientName && formik.errors.clientName ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.clientName}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="mobileNum">Mobile No</label>
                    <input
                      placeholder="Mobile No"
                      type="text"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "mobileNum"
                      )}`}
                      name="mobileNum"
                      {...formik.getFieldProps("mobileNum")}
                    />
                    {formik.touched.mobileNum && formik.errors.mobileNum ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.mobileNum}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="email">Email</label>
                    <input
                      placeholder="Email"
                      type="email"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "email"
                      )}`}
                      name="email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.email}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="gender">Gender</label>
                    <div className="col-lg-6 col-md-6 col-xs-12 mb-3">
                      <div className="genderWrapper">
                        <input type="radio" id="male" name="gender" value="Male" className="radioBtnWrapper" onChange={(e) => handleGenderRadioButtons(e)} checked={'Male' === formik.values.gender} />
                        <label for="male" className="radioBtnLabelWrapper">Male</label>
                        <input type="radio" id="female" name="gender" value="Female" className="radioBtnWrapper" onChange={(e) => handleGenderRadioButtons(e)} checked={'Female' === formik.values.gender} />
                        <label for="female" className="radioBtnLabelWrapper">Female</label>
                        <input type="radio" id="other" name="gender" value="Other" className="radioBtnWrapper" onChange={(e) => handleGenderRadioButtons(e)} checked={'Other' === formik.values.gender} />
                        <label for="other" className="radioBtnLabelWrapper">Other</label>
                      </div>
                      {formik.touched.gender && formik.errors.gender && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span role="alert">{formik.errors.gender}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {formik.touched.gender && formik.errors.gender ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.gender}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="email">Password</label>
                    <input
                      placeholder="Password"
                      type="password"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "password"
                      )}`}
                      name="password"
                      {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.password}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container react-datepicker-onboarding">
                    <label for="state">Date Of Birth</label><br />
                    <DatePicker
                      showYearDropdown
                      className="form-control form-control-solid h-auto py-3 px-4 w-100"
                      selected={formik.values.dateOfBirth}
                      onChange={(date) => formik.setFieldValue('dateOfBirth', date)}
                      dateFormat="dd/MM/YYYY"
                      placeholderText="dd/MM/YYYY"
                    />
                    {formik.touched.dateOfBirth && formik.errors.dateOfBirth ? (
                      <div>{formik.errors.dateOfBirth}</div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="state">State</label>
                    <SelectInputComponent
                      data={stateList}
                      isRequired={true}
                      label="State"
                      formikFunc={formik}
                      value={formik.values.state}
                      name="state"
                      handleBlur={formik.handleBlur}
                      testFunc={getUpdatedStateId}
                      className={`${getInputClasses(
                        "state"
                      )}`}
                    />
                    {formik.touched.state && formik.errors.state ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.state}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="city">City</label>
                    <SelectInputComponent
                      data={cityList}
                      isRequired={true}
                      label="City"
                      formikFunc={formik}
                      value={formik.values.city}
                      name={"city"}
                      handleBlur={formik.handleBlur}
                    />
                    {formik.touched.city && formik.errors.city ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.city}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <label for="address">Address</label>
                    <input
                      placeholder="Address"
                      type="text"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "address"
                      )}`}
                      name="address"
                      {...formik.getFieldProps("address")}
                    />
                    {formik.touched.address && formik.errors.address ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.address}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <SelectFileComponent
                      label="Upload Aadhar Card"
                      placeholder="Upload aadhar card"
                      isRequired={true}
                      formikFunc={formik}
                      name="aadharCard"
                      handleBlur={formik.handleBlur}
                      acceptType="image/*"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "aadharCard"
                      )}`}
                    />
                    {formik.touched.aadharCard && formik.errors.aadharCard ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.aadharCard}</div>
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group fv-plugins-icon-container">
                    <SelectFileComponent
                      label="Upload Pan Card"
                      placeholder="Upload Pan Card"
                      isRequired={true}
                      formikFunc={formik}
                      name="panCard"
                      handleBlur={formik.handleBlur}
                      acceptType="image/*"
                      className={`form-control form-control-solid h-auto py-3 px-4 ${getInputClasses(
                        "panCard"
                      )}`}
                    />
                    {formik.touched.panCard && formik.errors.panCard ? (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">{formik.errors.panCard}</div>
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
                      {loading && <span className="ml-3 spinner spinner-white"></span>}
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
            <div className="d-flex d-lg-none flex-column-auto flex-column flex-sm-row justify-content-between align-items-center mt-5 p-5">
              <div className="text-dark-50 font-weight-bold order-2 order-sm-1 my-2">
                &copy; 2020 Metronic
              </div>
              <div className="d-flex order-1 order-sm-2 my-2">
                <Link to="/terms" className="text-dark-75 text-hover-primary">
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  Legal
                </Link>
                <Link
                  to="/terms"
                  className="text-dark-75 text-hover-primary ml-4"
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientOnboarding;
