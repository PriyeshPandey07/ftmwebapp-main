import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from 'clsx'
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {SweetAlert} from '../../utils/helper';
import { put, get } from "../../components/api";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { Redirect, useLocation } from "react-router-dom"; // Import Redirect from react-router-dom
import moment from "moment";

// Validation schema
const employeeSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name is too short").max(30, "Name is too long"),
    mobileNum: Yup.string()
    .matches(/^[0-9]+$/, 'Mobile number must contain only numbers')
    .min(10, 'Mobile number have 10 digits')
    .max(10, 'Mobile number cannot exceed 10 digits')
    .required('Mobile number is required'),
    dateOfBirth: Yup.string().required("Date of Birth is required"),
    gender: Yup.string().required("Gender is required"),
    email: Yup.string().required("Email is required")
});

function EmployeeEditPage({ history }) {
  // Define your initial values
  let { id } = useParams();
  const location = useLocation();

  // Get the user role from Redux store
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const [employeeData, setEmployeeData] = useState();

  const employeeDetails = {
    name: "",
    mobileNum: "",
    dateOfBirth: "",
    gender: "",
    email: ""
  };

  const get18YearOld = () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear() - 18;
    if (dd < 10) {
      dd = '0' + dd
    }
    if (mm < 10) {
      mm = '0' + mm
    }

    today = yyyy + '-' + mm + '-' + dd;
    console.log('today ', today)
    return today
  }
  useEffect(() => {
    getEmployeeData(id)
  }, []);

  const getEmployeeData = async (id) => {
    if (id !== undefined && id !== null && id !== "") {
        const response = await get(`/superadmin/employee/${id}`);
        if (response.status === 200) {
            console.log(response.data);
            const newDate = new Date(response?.data?.dateOfBirth);
          await formik.setFieldValue("name", response?.data?.name);
          await formik.setFieldValue("gender", response?.data?.gender)
          await formik.setFieldValue("dateOfBirth", moment(response?.data?.dateOfBirth).format("YYYY-MM-DD"));
          await formik.setFieldValue("mobileNum", response?.data?.mobileNum);
          await formik.setFieldValue("email", response?.data?.email)
        } else {
            setEmployeeData({})
        }
    }
  }
 
  const formik = useFormik({
    initialValues: employeeDetails,
    validationSchema: employeeSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        const newDate = moment(values.dateOfBirth).format("DD/MM/YYYY");
        values.dateOfBirth = newDate;
        const response = await put(`/superadmin/employee/edit/${id}`, values);
        if (response.status === 200) {
          SweetAlert(response.message, false);
          setSubmitting(false);
          setTimeout(() => {
            history.push('/employees');
          }, 2000);
        } else {
          setSubmitting(false);
          SweetAlert(response.message, true);
        }
      } catch (ex) {
        setSubmitting(false);
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  });

  const handleGenderRadioButtons = (e)=> {
    formik.setFieldValue('gender', e.target.value);
  }

  // back to listing page
  const backToCompanyList = () => {
    history.push(`/employees`);
  };

  if (userRole === "admin" && window.location.pathname.includes("/employee/edit")) {
    return <Redirect to="/employees" />;
  }

  return (
    <Card>
      <CardHeader title={`Edit Employee`}>
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
            onClick={formik.handleSubmit}
            disabled={!(formik.dirty && formik.isValid) && !formik.isSubmitting}
          >
              Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <form
          id="kt_modal_add_task_form"
          className="form"
        //   onSubmit={formik.handleSubmit}
        //   noValidate
        >
        <div className="row">
          <div className="col-lg-6 mb-7">
            <label className="required fw-bold fs-6 mb-2">Name</label>
            <input
              placeholder="Employee Name"
              {...formik.getFieldProps("name")}
              type="text"
              name="name"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.name && formik.errors.name,
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
            <label className="required fw-bold fs-6 mb-2">Mobile Number</label>
            <input
              placeholder="Enter Mobile Number"
              {...formik.getFieldProps("mobileNum")}
              type="text"
              name="mobileNum"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.mobileNum && formik.errors.mobileNum,
                }
              )}
              autoComplete="off"
            />
            {formik.touched.mobileNum && formik.errors.mobileNum && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.mobileNum}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 mb-7">
            <label className="required fw-bold fs-6 mb-2">Email</label>
            <input
              placeholder="Enter Your Email"
              {...formik.getFieldProps("email")}
              type="email"
              name="email"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.email && formik.errors.email,
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
            <label className="required fw-bold fs-6 mb-2">Date Of Birth</label>
            <input
              placeholder="Date of Birth"
              {...formik.getFieldProps("dateOfBirth")}
              type="date"
              name="dateOfBirth"
              max={get18YearOld()}
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.email && formik.errors.email,
                }
              )}
              autoComplete="off"
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.dateOfBirth}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 mb-7">
            <label className="required fw-bold fs-6 mb-2">Gender</label>
            <div style={{"width":"60%","display":"flex", "alignItems": "center"}}>
              <input type="radio" id="male" name="gender" value="Male" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Male' === formik.values.gender}/>
              <label for="male" style={{"paddingRight":"1.5rem", 'paddingLeft': "0.25rem", "paddingTop":"0.5rem"}}>Male</label>
              <input type="radio" id="female" name="gender" value="Female" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Female' === formik.values.gender}/>
              <label for="female" style={{"paddingRight":"1.5rem", "paddingLeft": "0.25rem", "paddingTop":"0.5rem"}}>Female</label>
              <input type="radio" id="other" name="gender" value="Other" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Other' === formik.values.gender}/>
              <label for="other" style={{"paddingRight":"1.5rem", "paddingLeft":"0.25rem", "paddingTop":"0.5rem"}}>Other</label>
              </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.gender}</span>
                </div>
              </div>
            )}
          </div>
        </div>
          <button
            type="submit"
            style={{ display: "none" }}
          ></button>
        </form>
      </CardBody>
    </Card>
  );
}

export default EmployeeEditPage;
