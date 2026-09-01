import React, { useEffect, useRef } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
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

// Validation schema
const DeviceSchema = Yup.object().shape({
  serialNo: Yup.string().required("Serial No is required"),
  productName: Yup.string()
    .nullable()
    .required("Product Name is required"),
});

function DeviceEditPage() {
  const { id } = useParams();
  const userRole = useSelector(({ auth }) =>
    auth.user ? auth.user.user.role : null
  );
  const history = useHistory();

  const deviceData = {
    serialNo: "",
    productName: "",
  };

  const formik = useFormik({
    initialValues: deviceData,
    validationSchema: DeviceSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await put(`/superadmin/device/edit/${id}`, {
          serialNo: values.serialNo,
          productName: values.productName,
        });
        if (response.status === 200) {
          SweetAlert("Device updated successfully.", false);
          setTimeout(() => {
            history.push("/devices");
          }, 2000);
        } else {
          SweetAlert(response.message, true);
        }
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    (async () => {
      if (id !== undefined && id !== null && id !== "") {
        const response = await get(`/superadmin/device/${id}`);
        if (response.status === 200) {
          formik.setValues({
            ...response.data,
          });
        }
      }
    })();
  }, [id]);

  const btnRef = useRef();

  const handleSubmitData = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToDeviceList = () => {
    history.push(`/devices`);
  };

  // Check if the user is an admin and trying to access /devices/edit, then redirect them to /devices
  if (userRole === "admin" && window.location.pathname.includes("/devices/edit")) {
    return <Redirect to="/devices" />;
  }

  return (
    <Card>
      <CardHeader title={`Edit Device`}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToDeviceList}
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
            id="kt_modal_add_task_form"
            className="form"
            onSubmit={formik.handleSubmit}
            noValidate
          >
            <div className="col-lg-6 mb-7">
              <label className="required fw-bold fs-6 mb-2">Serial No</label>
              <input
                placeholder="Serial No"
                {...formik.getFieldProps("serialNo")}
                type="text"
                name="serialNo"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid": formik.touched.serialNo && formik.errors.serialNo,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.serialNo && formik.errors.serialNo && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.serialNo}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="col-lg-6 mb-5">
              <label className="required fw-bold fs-6 mb-2">Product Name</label>
              <input
                placeholder="Product Name"
                {...formik.getFieldProps("productName")}
                type="text"
                name="productName"
                className={clsx(
                  "form-control form-control-solid mb-3 mb-lg-0",
                  {
                    "is-invalid":
                      formik.touched.productName && formik.errors.productName,
                  }
                )}
                autoComplete="off"
              />
              {formik.touched.productName && formik.errors.productName && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.productName}</span>
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

export default DeviceEditPage;
