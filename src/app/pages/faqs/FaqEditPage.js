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

// Validation schema
const faqSchema = Yup.object().shape({
    title: Yup.string().required("Faq title is required"),
    description: Yup.string().required("Faq description is required"),
});

function FaqEditPage({ history }) {
  // Define your initial values
  let { id } = useParams();
  const location = useLocation();

  // Get the user role from Redux store
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const faqData = {
    title: "",
    description: ""
  };

  useEffect(() => {
    getFaqData(id)
  }, []);

  const getFaqData = async (id) => {
    if (id !== undefined && id !== null && id !== "") {
        const response = await get(`/superadmin/faqs/${id}`);
        if (response.status === 200) {
          await formik.setFieldValue("title", response?.data?.title);
          await formik.setFieldValue("description", response?.data?.description)
        } else {
            console.log('unable to get the data');
            SweetAlert("Unable to fetch the faq details, Try again");
            history.push('/faqs');
        }
    }
  }
 
  const formik = useFormik({
    initialValues: faqData,
    validationSchema: faqSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true)
      try {
        const response = await put(`/superadmin/faqs/edit/${id}`, values);
        if (response.status === 200) {
          SweetAlert(response.message, false);
          setSubmitting(false);
          setTimeout(() => {
            history.push('/faqs');
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

  // back to listing page
  const backToCompanyList = () => {
    history.push(`/faqs`);
  };

  if (userRole === "admin" && window.location.pathname.includes("/faq/edit")) {
    return <Redirect to="/faqs" />;
  }

  return (
    <Card>
      <CardHeader title={`Edit Faq`}>
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
            <label className="required fw-bold fs-6 mb-2">Title</label>
            <input
              placeholder="Title"
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

export default FaqEditPage;
