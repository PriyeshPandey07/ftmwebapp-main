// PlanAddPage.jsx
import React, { useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../_metronic/_partials/controls";
import { SweetAlert } from "../../utils/helper";
import { post } from "../../components/api";
import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";
import SelectInputComponent from "../../components/SelectInputComponent";

// Validation schema
const PlanSchema = Yup.object().shape({
  type: Yup.object().shape({
    _id: Yup.string().required(),
    name: Yup.string().required("Plan type is required"),
  }),
  name: Yup.string().required("Name is required").min(5, "Plan name too short").max(35, "Plan name too long"),
  unitPrice: Yup.number()
    .typeError("Price must be a number")
    .required("Price is required")
    .positive("Price must be a positive number")
    .min(100, "Price is too low")
    .max(100000, "Price is too high"),
  year: Yup.number()
    .typeError("Year must be a number")
    .required("Year is required")
    .positive("Year must be a positive number")
    .min(1)
    .max(5),
  discount: Yup.number()
    .typeError("Discount percentage must be a number")
    .min(0, "Discount should be positive integer")
    .max(100, "Discount should be lesser than 99")
});

function PlanAddPage({ history }) {
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  const location = useLocation();

  const planData = {
    type: {
      name: "",
      _id: ""
    },
    name: "",
    unitPrice: "",
    year: "",
    discount: "0"
  };

  const planType = [
    {
      name: "Gps Plan",
      _id: "GPS"
    },
    {
      name: "Fuel Sensor Plan",
      _id: "GPS_FUEL"
    },
    {
      name: "Gps Renewal Plan",
      _id: "GPS_RENEWAL"
    },
    {
      name: "Fuel Sensor Renewal Plan",
      _id: "FUEL_RENEWAL"
    }
  ]

  const formik = useFormik({
    initialValues: planData,
    validationSchema: PlanSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await post("/superadmin/plan/add", {
          type: values.type._id,
          name: values.name,
          unitPrice: values.unitPrice,
          year: values.year,
          discount: values.discount
        });
        if (response.status === 200) {
          SweetAlert("Plan added successfully.", false);
          setSubmitting(false);
          setTimeout(() => {
            history.push("/plans");
          }, 2000);
        } else {
          setSubmitting(false);
          SweetAlert(response.message, true);
        }
      } catch (ex) {
        setSubmitting(false);
        console.error(ex);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const btnRef = useRef();

  const handleSubmitData = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToPlanList = () => {
    history.push(`/plans`);
  };

  // Check if the user is an admin and trying to access /plans/add, then redirect them to /plans
  if (userRole === "admin" && location.pathname === "/plans/add") {
    return <Redirect to="/plans" />;
  }

  return (
    <Card>
      <CardHeader title={`Add New Plan`}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToPlanList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {"  "}
          {userRole !== "admin" && userRole !== "accounts" && (
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={handleSubmitData}
              disabled={formik.isSubmitting}
            >
              Save
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
          <form
            id="kt_modal_add_task_form"
            className="form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="col-lg-6 mb-7">
              <SelectInputComponent data={planType} label={"Plan Type"} isRequired={true} formikFunc={formik} name={"type"} handleBlur={formik.handleBlur} value={formik.values.type}/>
            </div>
            <div className="col-lg-6 mb-5">
              <label className="required fw-bold fs-6 mb-2">Name</label>
              <input
                placeholder="Name"
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
            <div className="col-lg-6 mb-5">
              <label className="required fw-bold fs-6 mb-2">Unit Price (Enter per year price)</label>
              <input
                placeholder="Price"
                {...formik.getFieldProps("unitPrice")}
                type="text"
                name="unitPrice"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.unitPrice && formik.errors.unitPrice,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.unitPrice && formik.errors.unitPrice && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.unitPrice}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-5">
              <label className="required fw-bold fs-6 mb-2">Year</label>
              <input
                placeholder="Enter Years"
                {...formik.getFieldProps("year")}
                type="text"
                name="year"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.year && formik.errors.year,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.year && formik.errors.year && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.year}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-5">
              <label className="fw-bold fs-6 mb-2">Discount (Optional)</label>
              <input
                placeholder="Enter Discount Percentage"
                {...formik.getFieldProps("discount")}
                type="text"
                name="discount"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.discount && formik.errors.discount,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.discount && formik.errors.discount && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.discount}</span>
                  </div>
                </div>
              )}
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

export default PlanAddPage;
