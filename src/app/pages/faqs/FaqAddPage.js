import React, { useEffect, useState, useRef } from "react";
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
import { post } from "../../components/api";
import { useSelector } from "react-redux"; // Import useSelector from react-redux
import { Redirect, useLocation } from "react-router-dom"; // Import Redirect from react-router-dom

// Validation schema
const faqSchema = Yup.object().shape({
    title: Yup.string().required("Faq title is required"),
    description: Yup.string().required("Faq description is required"),
});

function FaqAddPage({ history }) {
  // Define your initial values
  const location = useLocation();

  // Get the user role from Redux store
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const faqData = {
    title: "",
    description: ""
  };
  
  const formik = useFormik({
    initialValues: faqData,
    validationSchema: faqSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true)
      try {
        console.log('values ', values);
        const response = await post("/superadmin/faqs/add", values);
        if (response.status === 200) {
          SweetAlert("Faq added successfully.", false);
          setSubmitting(false);
          setTimeout(() => {
            history.push('/faqs');
          }, 2000);
        } else {
          setSubmitting(false);
          SweetAlert(response.message, true);
          resetForm()
        }
      } catch (ex) {
        setSubmitting(false);
        console.error(ex)
      } finally {
        setSubmitting(true)
      }
    },
  });

  // back to listing page
  const backToDeviceList = () => {
    history.push(`/faqs`);
  };

  if (userRole === "admin" && location.pathname === "/employee/add") {
    return <Redirect to="/faqs" />;
  }

  return (
    <Card>
      <CardHeader title={`Add New Faqs`}>
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
            type="submit"
            className="btn btn-primary ml-2"
            disabled={!(formik.dirty && formik.isValid) && !formik.isSubmitting}
            onClick={formik.handleSubmit}
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
            <label className="required fw-bold fs-6 mb-2">Title</label>
            <input
              placeholder="Enter Title"
              {...formik.getFieldProps("title")}
              type="text"
              name="title"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.title && formik.errors.title,
                }
              )}
              autoComplete="off"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.title}</span>
                </div>
              </div>
            )}
          </div>
          <div className="col-lg-6 mb-7">
            <label className="required fw-bold fs-6 mb-2">Description</label>
            <textarea
              placeholder="Enter Description"
              {...formik.getFieldProps("description")}
              type="text"
              name="description"
              className={clsx(
                "form-control form-control-solid mb-3 mb-lg-0",
                {
                  "is-invalid":
                    formik.touched.description && formik.errors.description,
                }
              )}
              autoComplete="off"
            />
            {formik.touched.description && formik.errors.description && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.description}</span>
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

export default FaqAddPage;