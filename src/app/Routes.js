/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import React from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import { Layout } from "../_metronic/layout";
import BasePage from "./BasePage";
import { Logout, AuthPage } from "./modules/Auth";
import ErrorsPage from "./modules/ErrorsExamples/ErrorsPage";
import ClientOnboarding from "./pages/Client/clientOnboarding";
import VehicleOnboarding from "./pages/vehicles/vehicleOnborading";
import SharePage from "./pages/Share/SharePage";

export function Routes() {
  const pathname = window.location.pathname
  const allowedPaths = ['/client-onboarding', '/vehicle-onboarding'];
  const isAllowed = (allowedPaths.includes(pathname) || pathname.includes("/share")) ? true : false;
  

  const { isAuthorized} = useSelector(
    ({ auth }) => ({
      isAuthorized: auth.user != null,
    }),
    shallowEqual
  );

  return (
    <Switch>

      {!isAuthorized && !isAllowed ? <AuthPage /> : (
        /*Otherwise redirect to root page (`/`)*/
        <Redirect from="/auth" to="/" />
      )}

      <Route path="/error" component={ErrorsPage} />
      <Route path="/client-onboarding" component={ClientOnboarding}/>
      <Route path="/vehicle-onboarding" component={VehicleOnboarding}/>
      <Route path="/share/:id" component={SharePage}/>
      <Route path="/logout" component={Logout} />


      {!isAuthorized ? (
        /*Redirect to `/auth` when user is not authorized*/
        <Redirect to="/auth/login" />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}

    </Switch>
  );
}
