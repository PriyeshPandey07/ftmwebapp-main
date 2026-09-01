import React, { useEffect, useState, useRef } from "react";
import { useFormik, validateYupSchema } from "formik";
import * as Yup from "yup";
import clsx from 'clsx'
import { ReactSelect } from "../../../_metronic/_partials/controls";
import { getUserByToken } from "../../modules/Auth/_redux/authCrud";
import * as auth from '../../modules/Auth/_redux/authRedux'
import { connect } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import {SweetAlert} from '../../utils/helper';
import { post, get, put } from "../../components/api";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { Redirect, useLocation } from "react-router-dom"; // Import Redirect from react-router-dom
import { isObject } from "lodash";
import { InputGroup } from "react-bootstrap";
import LockIcon from '@material-ui/icons/Lock';
import IconButton from '@material-ui/core/IconButton'
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

function UpdateProfile (props) {
  console.log('props ', props)
  const fileInputRef = useRef(null);
  let localStorageValues = JSON.parse(localStorage.getItem('persist:v706-demo1-auth'));
  let localUserData = JSON.parse(localStorageValues.user);
  const backToDeviceList = () => {
    props.history.push(`/dashboard`);
  };
  const [oldPass, setOldPass] = useState(false);
  const [pass, setPass] = useState(false);
  const [confirmPass, setConfirmPass] = useState(false);

  const togglePasswordVisibility = (type) => {
    if (type === "oldPass") {
      setOldPass(!oldPass);
    }
    if (type === "pass") {
      setPass(!pass);
    }
    if (type === "confirmPass") {
      setConfirmPass(!confirmPass);
    }
  };

  const getInputClasses = (fieldname) => {
    if (formikPassword.touched[fieldname] && formikPassword.errors[fieldname]) {
      return "is-invalid";
    }

    if (formikPassword.touched[fieldname] && !formikPassword.errors[fieldname]) {
      return "is-valid";
    }

    return "";
  };
  const passwordValidationSchema = Yup.object().shape({
    newPass: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, "Maximum 20 characters allowed")
    .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
    ),
    confirmNewPass: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .max(20, "Maximum 20 characters allowed")
    .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
    "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
    )
      .when("newPass", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("newPass")],
          "Password and Confirm Password didn't match"
        ),
      }),
      oldPass: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(20, "Maximum 20 characters allowed")
      .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain One Uppercase, One Lowercase, One Number and One Special Character"
      )
  })

  const formValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required").min(2, "Name is too short").max(30, "Name is very long"),
    email: Yup.string().email("Invalid email format").required('Email is required'),
    profilePhoto: Yup.mixed("Photo must be a file").required("Photo is required"),
    gender: Yup.string().required("Gender is required"),
    profilePhotoReview: Yup.mixed("Photo must be a file").required("Photo is required")
  })

  // file upload 
  const handleFileUpload = (event, name) => {
    event.preventDefault()
    var fileType = event.target.files[0].name.split('.').pop().toLowerCase();
    if (event.target.files.length > 0) {
      if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg') {
        if (name === 'profilePhoto') {
          formikProfile.setFieldValue(name, event.currentTarget.files[0]);
          formikProfile.setFieldValue('', event.currentTarget.files[0]);
          formikProfile.setFieldValue('profilePhotoReview', URL.createObjectURL(event.currentTarget.files[0]));
          //formikProfile.setFieldValue('profilePhoto', event.currentTarget.files[0].name);
        }
      }
    }
  }

  const formikProfile = useFormik({
    initialValues: {
        name: "",
        email: "",
        profilePhoto: "",
        gender: "",
        profilePhotoReview: ""
    },
    validationSchema: formValidationSchema,
    onSubmit: async (values, {setSubmitting})=> {
      setSubmitting(true);
      const formData = new FormData();

      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('gender', values.gender);
      console.log('profilePhoto ', values.profilePhoto)
      if (isObject(values.profilePhoto)) {
        formData.append('profilePhoto', values.profilePhoto)
      } else if (values.profilePhoto === null) {
        formData.append("profilePhoto", null);
      }
       const updateData = await put("/user/profile/edit", formData);
       if(updateData.status === 200) {
        SweetAlert(updateData.message, false);
          setSubmitting(false);
          await props.requestUser()
          // console.log('use ', user)
          console.log('this is the console')
          setTimeout(() => {
            //history.push("/user/profile");
          }, 2000);
       } else if (updateData.status === 400) {
        SweetAlert(updateData.message, false);
        setSubmitting(false);
        setTimeout(()=> {
          //history.push("/user/profile")
        }, 2000);
       }
    }
  });

  const formikPassword = useFormik({
    initialValues: {
        oldPass: "",
        newPass: "",
        confirmNewPass: ""
    },
    validationSchema: passwordValidationSchema,
    onSubmit: async (values, {setSubmitting, resetForm})=> {
        console.log("values ", values);
        setSubmitting(true);
        let updatePassBody = {
          newPass: values.newPass,
          oldPass: values.oldPass
        }
        let updatePass = await put("/user/change-password", updatePassBody);
        console.log('updtePass ', updatePass)
        if (updatePass.status === 200) {
          setSubmitting(false);
          //props.logout(); // Logout function
          SweetAlert(updatePass.message, false);
          resetForm();
        } else if (updatePass.status === 400) {
          console.log('we re in error ', updatePass.message)
          SweetAlert(updatePass.message, true);
          setSubmitting(false);
          resetForm();
        }
    }
  });

  const handleGenderRadioButtons = (e)=> {
    formikProfile.setFieldValue('gender', e.target.value)
  }

  useEffect(()=> {
        const getProfile = async ()=> {
          const getData = await get("/profile");
          console.log('we are getting the getProfile ', getData);
          await formikProfile.setFieldValue("name", getData?.user?.fullname);
          await formikProfile.setFieldValue("gender", getData?.user?.gender)
          await formikProfile.setFieldValue("email", getData?.user?.email);
          console.log('getData?.user?.photo ',getData?.user?.photo)
            console.log("we are here sldfs")
            await formikProfile.setFieldValue("photo", getData?.user?.photo);
            await formikProfile.setFieldValue('profilePhoto', getData?.user?.photo)
            await formikProfile.setFieldValue('profilePhotoReview',getData?.user?.photo);
        };
        getProfile();
  }, []);

    return (
    <>
      <Card>
        <CardHeader title={`Update profile`}>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToDeviceList}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            {`  `}
            <button
              type="button"
              className="btn btn-primary ml-2"
              onClick={formikProfile.handleSubmit}
              //disabled={formik.isSubmitting}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <form
            id="kt_modal_add_task_form"
            className="form"
            //onSubmit={formik.handleSubmit}
            //noValidate
          >
          <div className="row">
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Name</label>
              <input
                placeholder="Company Name"
                type="text"
                name="name"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0"
                )}
                value={formikProfile.values.name}
                onChange={formikProfile.handleChange}
                onBlur={formikProfile.handleBlur}
                //autoComplete="off"
              />
              {formikProfile.touched.name && formikProfile.errors.name && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formikProfile.errors.name}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Email</label>
              <input
                placeholder="Email"
                type="text"
                name="emial"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0"
                )}
                autoComplete="off"
                disabled
                value={formikProfile.values.email}
              />
              {/* {formik.touched.ownerName && formik.errors.ownerName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.ownerName}</span>
                  </div>
                </div>
              )} */}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Gender</label><br/>
              <div style={{"width":"60%","display":"flex", "alignItems": "center"}}>
              <input type="radio" id="male" name="gender" value="Male" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Male' === formikProfile.values.gender}/>
              <label for="male" style={{"paddingRight":"1.5rem", 'paddingLeft': "0.25rem", "paddingTop":"0.5rem"}}>Male</label>
              <input type="radio" id="female" name="gender" value="Female" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Female' === formikProfile.values.gender}/>
              <label for="female" style={{"paddingRight":"1.5rem", "paddingLeft": "0.25rem", "paddingTop":"0.5rem"}}>Female</label>
              <input type="radio" id="other" name="gender" value="Other" style={{"width":"1.25rem", "height":"1.25rem"}} onChange={(e)=> handleGenderRadioButtons(e)} checked={'Other' === formikProfile.values.gender}/>
              <label for="other" style={{"paddingRight":"1.5rem", "paddingLeft":"0.25rem", "paddingTop":"0.5rem"}}>Other</label>
              </div>
              {/* {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.email}</span>
                  </div>
                </div>
              )} */}
            </div>
            <div className="col-lg-6 mb-5">
              <label>Upload Profile Photo</label><br />
              {formikProfile.values.profilePhoto && formikProfile.values.profilePhoto !== "null" && formikProfile.values.profilePhotoReview !== "null" && (
                <div className="d-flex flex-column align-items-start">
                  <img src={formikProfile.values.profilePhotoReview} alt="Uploaded" width="100px" height="100px" />
                </div>
              )}
            <div className="mt-3">
              <button
                type="button"
                className={`btn btn-primary font-weight-bold mr-2`}
                onClick={() => fileInputRef.current.click()}
              >
                {formikProfile.values.profilePhoto && formikProfile.values.profilePhoto !== "null" ? "Change" : "Upload"}
                <input
                  name="profilePhoto"
                  accept="image/*"
                  id={`upload-image`}
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={(event) => handleFileUpload(event, 'profilePhoto')}
                  onClick={(e)=> { 
                    e.target.value = null
                  }}
                />
              </button>
              {formikProfile.values.profilePhoto && formikProfile.values.profilePhoto !== "null" && <button
                type="button"
                className={`btn btn-danger font-weight-bold mr-2`}
                onClick={() => {
                  formikProfile.setFieldValue('profilePhoto', null);
                  formikProfile.setFieldValue('profilePhotoReview', null)
                }}
              >
                Remove
              </button>}
              {formikProfile.touched.profilePhoto && formikProfile.errors.profilePhoto && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span>{formikProfile.errors.profilePhotoReview}</span>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
            <button
              type="submit"
              style={{ display: "none" }}
            ></button>
          </form>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title={`Change Password`}>
          <CardHeaderToolbar>
            {`  `}
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={formikPassword.handleSubmit}
              disabled={!(formikPassword.dirty && formikPassword.isValid) && !formikPassword.isSubmitting}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <form
            id="kt_modal_add_task_form"
            className="form"
            //onSubmit={formik.handleSubmit}
            //noValidate
          >
          <div className="row">
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Old Password</label>
              {/* <input
                placeholder="Enter your old password"
                type="password"
                name="oldPass"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0"
                )}
                onChange={formikPassword.handleChange}
                onBlur={formikPassword.handleBlur}
                value={formikPassword.values.oldPass}
                //autoComplete="off"
              /> */}
              <InputGroup>
            <input
              placeholder="Password"
              type={oldPass ? 'text' : 'password'}
              className={`form-control form-control-solid h-auto px-3 ${getInputClasses(
                "oldPass"
              )}`}
              name="password"
              style={{"paddingTop":"0.75rem", "paddingBottom":"0.75rem"}}
              {...formikPassword.getFieldProps("oldPass")}
              />
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2">
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>togglePasswordVisibility("oldPass")} className="p-0">
                  {oldPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
              {formikPassword.touched.oldPass && formikPassword.errors.oldPass && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formikPassword.errors.oldPass}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">New Password</label>
              {/* <input
                placeholder="Enter your new password"
                type="password"
                name="newPass"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0"
                )}
                autoComplete="off"
                onChange={formikPassword.handleChange}
                onBlur={formikPassword.handleBlur}
                value={formikPassword.values.newPass}
              /> */}
              <InputGroup>
            <input
              placeholder="Password"
              type={pass ? 'text' : 'password'}
              className={`form-control form-control-solid h-auto px-3 ${getInputClasses(
                "pass"
              )}`}
              name="newPass"
              style={{"paddingTop":"0.75rem", "paddingBottom":"0.75rem"}}
              {...formikPassword.getFieldProps("newPass")}
              />
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2">
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>togglePasswordVisibility("pass")} className="p-0">
                  {pass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
              {formikPassword.touched.newPass && formikPassword.errors.newPass && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formikPassword.errors.newPass}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Confirm New Password</label>
              {/* <input
                placeholder="Confirm your password"
                type="password"
                name="confirmNewPass"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0"
                )}
                autoComplete="off"
                onChange={formikPassword.handleChange}
                onBlur={formikPassword.handleBlur}
                value={formikPassword.values.confirmNewPass}
              /> */}
              <InputGroup>
            <input
              placeholder="Password"
              type={confirmPass ? 'text' : 'password'}
              className={`form-control form-control-solid h-auto px-3 ${getInputClasses(
                "confirmPass"
              )}`}
              name="confirmNewPass"
              style={{"paddingTop":"0.75rem", "paddingBottom":"0.75rem"}}
              {...formikPassword.getFieldProps("confirmNewPass")}
              />
            <InputGroup.Prepend>
              <InputGroup.Text id="basic-addon2">
                <IconButton color="primary" aria-label="upload picture" component="span" onClick={()=>togglePasswordVisibility("confirmPass")} className="p-0">
                  {confirmPass ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputGroup.Text>
            </InputGroup.Prepend>
          </InputGroup>
              {formikPassword.touched.confirmNewPass && formikPassword.errors.confirmNewPass && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formikPassword.errors.confirmNewPass}</span>
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
    </>
    )
}

export default connect(null, auth.actions)(UpdateProfile);