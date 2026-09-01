import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { TrashFill } from "react-bootstrap-icons";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { showConfirmDialog, SweetAlert } from "../../utils/helper";
import { put, get } from "../../components/api";

const aboutValidationSchema = Yup.object().shape({
  bannerImagePreview: Yup.string(),
  bannerImage: Yup.string().when('bannerImagePreview', {
    is: (bannerImagePreview) => !bannerImagePreview,
    then: Yup.string().required("Banner Image is required"),
    otherwise: Yup.string()
  }),
  fields: Yup.array().of(
    Yup.object().shape({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
    })
  ),
});

function AboutPage({ history }) {
  const fileInputRef = useRef(null);
  const aboutData = {
    bannerImage: "",
    bannerImagePreview: "",
    content: [
      {
        title: "",
        description: "",
      },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAboutusData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const getAboutusData = async () => {
    const response = await get(`/superadmin/about-us`);
    console.log('response', response);
    if (response.status === 200) {
      let data = {...response.data};
      data.bannerImage = '';
      data.bannerImagePreview = response.data.bannerImage;
      formik.setValues({
        ...data,
      });
    }
  };

  const openDeleteDialog = async (id) => {
    const confirmed = await showConfirmDialog(
      "Delete!",
      "Are you sure you want to delete employee?"
    );
    if (confirmed) {
      let contentArray = formik.values.content;
      contentArray.splice(id, 1);
      formik.setFieldValue('content', contentArray)
    }
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
        if (name === "bannerImage") {
          formik.setFieldValue(name, event.currentTarget.files[0]);
          formik.setFieldValue(
            "bannerImagePreview",
            URL.createObjectURL(event.currentTarget.files[0])
          );
        }
      }
    }
  };

  const formik = useFormik({
    initialValues: aboutData,
    validationSchema: aboutValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
        const hasBlankFields = values.content.some(
            (field) => field.title.trim() === '' || field.description.trim() === ''
          );
          if (hasBlankFields) {
            SweetAlert('Please fill in all title and description fields.', true);
          } else {
            let form_data = new FormData();
            console.log("Hii", values);
            if (values.bannerImage !== '') {
              form_data.append("bannerImage", values.bannerImage);
            }
            form_data.append('content', JSON.stringify(values.content));
            let updateAboutUs = await put("/superadmin/about-us", form_data);
            if (updateAboutUs.status === 200) {
              SweetAlert("About us updated successfully", false);
              history.push('/aboutus')
            } else {
              SweetAlert(updateAboutUs.message, true);
              history.push("/aboutus")
            }
          }
    },
  });

  // back to listing page
  const backToDashboard = () => {
    history.push(`/dashboard`);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader title={`AboutUs`}>
          <CardHeaderToolbar>
            <button
              type="button"
              onClick={backToDashboard}
              className="btn btn-light"
            >
              <i className="fa fa-arrow-left"></i>
              Back
            </button>
            {`  `}
            <button type="submit" className="btn btn-primary ml-2">
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="col-lg-6 mb-5">
            <label className="required fw-bold fs-6 mb-2">
              Upload Banner Image
            </label>
            <br />
            {formik.values.bannerImagePreview && (
              <div className="d-flex flex-column align-items-start">
                <img
                  src={formik.values.bannerImagePreview}
                  alt="Uploaded"
                  width="150px"
                  height={`100%`}
                  style={{ maxHeight: '150px' }}
                />
              </div>
            )}
            <div className="mt-3">
              <button
                type="button"
                className={`btn btn-primary font-weight-bold mr-2`}
                onClick={() => fileInputRef.current.click()}
              >
                {formik.values.bannerImage ? "Change" : "Upload"}
                <input
                  name="bannerImage"
                  accept="image/*"
                  id={`upload-image`}
                  type="file"
                  ref={fileInputRef}
                  hidden
                  onChange={(event) => handleFileUpload(event, "bannerImage")}
                  onClick={(e) => {
                    e.target.value = null;
                  }}
                />
              </button>
              {formik.values.bannerImage && (
                <button
                  type="button"
                  className={`btn btn-danger font-weight-bold mr-2`}
                  onClick={() => {
                    formik.setFieldValue("bannerImage", null);
                    formik.setFieldValue("bannerImagePreview", null)
                  }}
                >
                  Remove
                </button>
              )}
              {formik.touched.bannerImage && formik.errors.bannerImage && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span>{formik.errors.bannerImagePreview}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {formik.values.content.map((field, index) => (
            <div className="row" key={index}>
              <div className="col-md-5 mb-7">
                <label
                  htmlFor={`content.${index}.title`}
                  className="required fw-bold fs-6 mb-2"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id={`content.${index}.title`}
                  name={`content.${index}.title`}
                  className="form-control form-control-solid mb-3 mb-lg-0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={field.title}
                />
                {formik.touched[`content.${index}.title`] &&
                  formik.errors[`content.${index}.title`] && (
                    <div>{formik.errors[`content.${index}.title`]}</div>
                  )}
              </div>
              <div className="col-md-6 mb-7">
                <label
                  htmlFor={`content.${index}.description`}
                  className="required fw-bold fs-6 mb-2"
                >
                  Description:
                </label>
                <textarea
                  type="textarea"
                  id={`content.${index}.description`}
                  name={`content.${index}.description`}
                  className="form-control form-control-solid"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  rows={2}
                  value={field.description}
                ></textarea>
                {formik.touched[`content.${index}.description`] &&
                  formik.errors[`content.${index}.description`] && (
                    <div>{formik.errors[`content.${index}.description`]}</div>
                  )}
              </div>
              <div className="col-md-1 d-flex justify-content-center align-items-center">
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`products-delete-tooltip-${index}`}>
                      Delete
                    </Tooltip>
                  }
                >
                  <a
                    className="btn btn-icon btn-light btn-hover-danger btn-sm"
                    onClick={() => {
                      openDeleteDialog(index)
                    }
                  }
                  >
                    <TrashFill size={16} />
                  </a>
                </OverlayTrigger>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-primary"
            onClick={() =>
              formik.setFieldValue(`content`, [
                ...formik.values.content,
                { title: "", description: "" },
              ])
            }
          >
            Add Field
          </button>
        </CardBody>
      </Card>
    </form>
  );
}

export default AboutPage;
