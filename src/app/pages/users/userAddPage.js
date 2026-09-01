import React, { useEffect, useState, useRef } from "react";
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
import { post, get } from "../../components/api";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { Redirect, useLocation } from "react-router-dom"; // Import Redirect from react-router-dom
import { InputGroup } from "react-bootstrap";
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

// Validation schema
const userSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").min(2, "Name is too short").max(30, "Name is too long"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
  .required("Password is required")
  .min(8, 'Password must be at least 8 characters')
  .max(20, "Maximum 20 characters allowed")
  .matches(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
  "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
  ),
  role: Yup.string().required("Role is required"),
  gender: Yup.string().required("Gender is required")
});

function UserAddPage({ history }) {
  const [roles] = useState(["admin", "superadmin", "accounts"]);
  const fileInputRef = useRef(null);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();

  // Get the user role from Redux store
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getInputClasses = (fieldname) => {
    if (formik.touched[fieldname] && formik.errors[fieldname]) {
      return "is-invalid";
    }

    if (formik.touched[fieldname] && !formik.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };

  const userData = {
    name: "",
    email: "",
    password: "",
    role: "",
    gender: ""
  };

  const formik = useFormik({
    initialValues: userData,
    validationSchema: userSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let form_data = new FormData();
        form_data.append("name", values.name);
        form_data.append("email", values.email);
        form_data.append("password", values.password);
        form_data.append("role", values.role);
        form_data.append('gender', values.gender)
        //  form submission logic here
        const response = await post("/superadmin/user/add", values);
        if (response.status === 200) {
          SweetAlert("User added successfully.", false);
          setSubmitting(false);
          setTimeout(() => {
            history.push("/users");
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

  const handleSubmitData = () => {
    formik.handleSubmit();
  };

  const handleGenderRadioButtons = (e)=> {
    formik.setFieldValue('gender', e.target.value);
  }

  // Check if the user is an admin and trying to access /user/add, then redirect them to /users
  if (userRole === "admin" && location.pathname === "/user/add") {
    return <Redirect to="/users" />;
  }

  return (
    <>
      <Card>
        <CardHeader title={`Add New User`}>
          <CardHeaderToolbar>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => history.push("/users")} // Redirect to the users page
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            {"  "}

            
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
              id="user_add_form"
              className="form"
              onSubmit={formik.handleSubmit}
              noValidate
            >
              <div className="row">
                <div className="col-lg-6 mb-7">
                  <label className="required fw-bold fs-6 mb-2">Name</label>
                  <input
                    placeholder="User Name"
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
                  <label className="required fw-bold fs-6 mb-2">Email</label>
                  <input
                    placeholder="Email"
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
                   <label className="required fw-bold fs-6 mb-2">
                    Password
                  </label>
                  {/*<input
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
                  /> */}
                  <InputGroup>
            <input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control form-control-solid h-auto px-3 ${getInputClasses(
                "password"
              )}`}
              name="password"
              style={{"paddingTop":"0.75rem", "paddingBottom":"0.75rem"}}
              {...formik.getFieldProps("password")}
              />
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2">
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={togglePasswordVisibility} className="p-0">
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
          {formik.touched.password && formik.errors.password ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.password}</div>
            </div>
          ) : null}
                  
                </div>
                <div className="col-lg-6 mb-5">
                  <label className="required fw-bold fs-6 mb-2">Role</label>
                  <select
                    name="role"
                    {...formik.getFieldProps("role")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid": formik.touched.role && formik.errors.role,
                      }
                    )}
                  >
                    <option value="" label="Select Role" />
                    {roles.map((role) => (
                      <option key={role} value={role} label={role} />
                    ))}
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.role}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-6 mb-7">
            <label className="required fw-bold fs-6 mb-2">Gender</label>
            <div style={{"width":"60%","display":"flex", "alignItems": "center"}}>
              <input type="radio" id="Male" name="gender" value="Male" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Male' === formik.values.gender}/>
              <label for="male" style={{"paddingRight":"1.5rem", 'paddingLeft': "0.25rem", "paddingTop":"0.5rem"}}>Male</label>
              <input type="radio" id="Female" name="gender" value="Female" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Female' === formik.values.gender}/>
              <label for="female" style={{"paddingRight":"1.5rem", "paddingLeft": "0.25rem", "paddingTop":"0.5rem"}}>Female</label>
              <input type="radio" id="Other" name="gender" value="Other" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Other' === formik.values.gender}/>
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
                disabled={formik.isSubmitting}
              ></button>
            </form>
        </CardBody>
      </Card>
    </>
  );
}

export default UserAddPage;
