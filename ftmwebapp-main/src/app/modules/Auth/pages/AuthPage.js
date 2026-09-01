/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {Switch, Redirect} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_metronic/_helpers";
import {ContentRoute} from "../../../../_metronic/layout"
import Login from "./Login";
import "../../../../_metronic/_assets/sass/pages/login/classic/login-1.scss";

export function AuthPage() {
  return (
      <>
        <div className="d-flex flex-column flex-root">
          {/*begin::Login*/}
          <div
            className="login login-1 login-signin-on d-flex flex-column flex-lg-row bg-white h-100"
            id="kt_login" style={{
              backgroundImage: `url(${toAbsoluteUrl("/media/bg/bg-1.png")})`
            }}
          >
            {/*begin::Content*/}
            <div className="row w-100 d-flex align-items-center position-relative p-12 overflow-hidden">
              <div className="col-12 col-xs-12 col-md-7 left-part-login-page">
                <h1 className="fleet-title">Welcome to FleetStakes</h1>
                <p className="fleet-subtitle">Your fleet journey begins here.</p>
                <div style={{
                  backgroundImage: `url(${toAbsoluteUrl("/media/bg/map.png")})`,
                  width:"759px",
                  height:"383px"
                }}>
                  <img src={toAbsoluteUrl("/media/bg/logo.png")} alt="" width="704px" height="393px" />
                </div>
              </div>
              <div className="col-12 col-xs-12 col-md-5">
                <div className="login-parent-right-side">
                  <Switch>
                    <ContentRoute path="/auth/login" component={Login}/>
                    <Redirect from="/auth" exact={true} to="/auth/login"/>
                    <Redirect to="/auth/login"/>
                  </Switch>
                </div>
              </div>
              {/*end::Content body*/}
            </div>
            {/*end::Content*/}
          </div>
          {/*end::Login*/}
        </div>
      </>
  );
}
