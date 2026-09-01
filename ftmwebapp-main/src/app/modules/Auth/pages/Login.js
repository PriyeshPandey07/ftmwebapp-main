import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { InputGroup } from "react-bootstrap";
import { injectIntl } from "react-intl";
import * as auth from "../_redux/authRedux";
import { login } from "../_redux/authCrud";
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";

const initialValues = {
  email: "",
  password: "",
  // role:"",      //added role
};

function Login(props) {
  const { intl } = props;
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      ),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, "Maximum 20 characters allowed")
      .required(
        intl.formatMessage({
          id: "AUTH.VALIDATION.REQUIRED_FIELD",
        })
      )
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
      )
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const enableLoading = () => {
    setLoading(true);
  };

  const disableLoading = () => {
    setLoading(false);
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

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { setStatus, setSubmitting }) => {
      enableLoading();
      login(values.email, values.password)
        .then(({ data }) => {
          if (data.status === 200) {
            disableLoading();
            props.login(data.data.accessToken);
            localStorage.setItem("loginToken",data.data.accessToken)
          } else {
            disableLoading();
            setSubmitting(false);
            setStatus(data.message);
          }
          
        })
        .catch((error) => {
          disableLoading();
          setSubmitting(false);
          setStatus(error.message);
        });
    },
  });

  return (
    <div className="login-form login-signin" id="kt_login_signin_form">
      {/* begin::Head */}
      <div className="d-flex flex-center mb-5">
				<a href="#">
					<img src={toAbsoluteUrl("/media/logos/logo-login-light.png")} className="max-h-100px" alt="" />
				</a>
			</div>
      <div className="text-center">
        <p className="text-grey mb-15">
          Please log in to continue.
        </p>
      </div>
      {/* end::Head */}

      {/*begin::Form*/}
      <form
        onSubmit={formik.handleSubmit}
        className="form fv-plugins-bootstrap fv-plugins-framework mt-5"
      >
        {formik.status && (
          <div className="mb-5 mt-5 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}

        <div className="form-group fv-plugins-icon-container">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1"><EmailIcon /></InputGroup.Text>
            </InputGroup.Prepend>
            <input
              placeholder="Email"
              type="email"
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "email"
              )}`}
              name="email"
              {...formik.getFieldProps("email")}
            />
          </InputGroup>
          {formik.touched.email && formik.errors.email ? (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">{formik.errors.email}</div>
            </div>
          ) : null}
        </div>
        <div className="form-group fv-plugins-icon-container">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon1"><LockIcon /></InputGroup.Text>
            </InputGroup.Prepend>
            <input
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control form-control-solid h-auto py-5 px-6 ${getInputClasses(
                "password"
              )}`}
              name="password"
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
        <div className="form-group d-flex justify-content-center align-items-center">
          <button
            id="kt_login_signin_submit"
            type="submit"
            disabled={formik.isSubmitting}
            className={`btn login-btn px-9 py-4 my-3`}
          >
            <span>Sign In</span>
            {loading && <span className="ml-3 spinner spinner-green"></span>}
          </button>
        </div>
      </form>
      {/*end::Form*/}
    </div>
  );
}

export default injectIntl(connect(null, auth.actions)(Login));
