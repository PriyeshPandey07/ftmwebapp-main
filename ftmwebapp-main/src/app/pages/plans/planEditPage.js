// PlanEditPage.jsx
import React, { useEffect, useRef } from "react";
import { useParams, Redirect, useLocation } from "react-router-dom";
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
import { put, get } from "../../components/api";
import { useSelector } from "react-redux";
import SelectInputComponent from "../../components/SelectInputComponent";

// Validation schema
const PlanSchema = Yup.object().shape({
  type: Yup.object().shape({
    _id: Yup.string().required(),
    name: Yup.string().required("Plan type is required"),
  }),
  name: Yup.string().required("Name is required").min(5, "Plan name too short").max(35, "Plan name too long"),
  unitPrice: Yup.number()
    .required("Unit Price is required")
    .positive("Unit Price must be a positive number")
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

function PlanEditPage({ history }) {
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );

  let { id } = useParams();

  const planData = {
    type: {
      _id: "",
      name: ""
    },
    name: "",
    unitPrice: "",
    year: "",
    discount: ""
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
        const formData = {
          type: values.type._id,
          name: values.name,
          unitPrice: values.unitPrice,
          discount: values.discount,
          year: values.year
        };

        // Make a PUT request to update the plan data
        const response = await put(`/superadmin/plan/edit/${id}`, formData);

        if (response.status === 200) {
          SweetAlert("Plan updated successfully.", false);
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
      }
    },
  });

  useEffect(() => {
    (async () => {
      if (id !== undefined && id !== null && id !== "") {
        const response = await get(`/superadmin/plan/${id}`);
        if (response.status === 200) {
          console.log('data ', response.data.type)
          await formik.setFieldValue('type', {
            name: (response.data.type === "GPS") ? "Gps plan" : "Gps + Fuel Sensor Plan",
            _id: response.data.type
          });
          await formik.setFieldValue('name', response.data.name);
          await formik.setFieldValue('unitPrice', response.data.unitPrice);
          await formik.setFieldValue('year', response.data.year);
          await formik.setFieldValue('discount', response.data.discount)
        }
      }
    })();
  }, []);

  const btnRef = useRef();

  const handleSubmitData = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToPlanList = () => {
    history.push(`/plans`);
  };

  // Check if the user is an admin and trying to access /plans/edit, then redirect them to /plans
  const location = useLocation();

  if (userRole === "admin" && location.pathname.includes("/plans/edit")) {
    return <Redirect to="/plans" />;
  }

  return (
    <Card>
      <CardHeader title={`Edit Plan`}>
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
            >
              Save
            </button>
          )}
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
          <form
            id="plan_edit_form"
            className="form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="col-lg-6 mb-7">
              <SelectInputComponent data={planType} label={"Plan Type"} isRequired={true} formikFunc={formik} name={"type"} value={formik.values.type}/>
            </div>
            <div className="col-lg-6 mb-7">
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
              <label className="required fw-bold fs-6 mb-2">Unit Price</label>
              <input
                placeholder="Unit Price"
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
                placeholder="Year"
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
                placeholder="Discount"
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

                  export default PlanEditPage;

