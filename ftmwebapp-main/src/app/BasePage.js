import React, {Suspense } from "react";
import {Redirect, Switch, Route} from "react-router-dom";
import {LayoutSplashScreen, ContentRoute} from "../_metronic/layout";
import {BuilderPage} from "./pages/BuilderPage";
import {MyPage} from "./pages/MyPage";
import {DashboardPage} from "./pages/DashboardPage";
import UserPage from "./pages/users/UserPage";
import UserAddPage from "./pages/users/userAddPage";
import UserEditPage from "./pages/users/userEditPage";
import DevicePage from "./pages/devices/devicePage";
import DeviceAddPage from "./pages/devices/deviceAddPage";
import DeviceEditPage from "./pages/devices/deviceEditPage";
import CompanyPage from "./pages/Companies/companyPage";
import CompanyAddPage from "./pages/Companies/companyAddPage";
import CompanyEditPage from "./pages/Companies/companyEditPage";
import VehiclePage from "./pages/vehicles/vehiclePage";
import DriverPage from "./pages/drivers/driverPage";
// import TripPage from "./pages/trips/tripPage.js";
import PlanPage from "./pages/plans/planPage";
import PlanAddPage from "./pages/plans/planAddPage";
import PlanEditPage from "./pages/plans/planEditPage";
import profileUpdatePage from "./pages/profile/updateProfile";
import Feedback from "./pages/Feedback/feedback";
import EmployeePage from "./pages/employees/EmployeePage";
import EmployeeAddPage from "./pages/employees/EmployeeAddPage";
import EmployeeEditPage from "./pages/employees/EmployeeEditPage";
import AboutPage from "./pages/about/aboutPage";
import LiveLocationTracking from "./pages/LiveLocationTracking";
import Faqpage from "./pages/faqs/FaqPage";
import FaqAddPage from "./pages/faqs/FaqAddPage";
import FaqEditPage from "./pages/faqs/FaqEditPage";
import SupportPage from "./pages/Support/SupportPage";
import SimPage from "./pages/sim/simPage"
import ReportPage from "./pages/Reports/ReportPage";
import VehicleDetails from "./pages/vehicles/vehicleDetails";
import vehicleMap from "./pages/vehicles/vehicleMap";
import VehicleMap from "./pages/vehicles/vehicleMap";
// import LiveLocationTracking from "./pages/LiveLocationTracking";

export default function BasePage() {
    return (
        <Suspense fallback={<LayoutSplashScreen/>}>
            <Switch>
                {
                    /* Redirect from root URL to /dashboard. */
                    <Redirect exact from="/" to="/dashboard"/>
                }
                <ContentRoute path="/dashboard" component={DashboardPage}/>
                <ContentRoute path="/builder" component={BuilderPage}/>
                <ContentRoute path="/my-page" component={MyPage}/>
                <Route path="/users" component={UserPage}/>
                <Route path="/user/add" component={UserAddPage}/>
                <Route path="/sim-cards" component={SimPage} />
                <Route path="/user/edit/:id" component={UserEditPage} />
                <Route path="/devices/add" component={DeviceAddPage}/>
                <Route path="/devices/edit/:id" component={DeviceEditPage}/>
                <Route path="/devices" component={DevicePage}/>
                <Route path="/fleet-owner/edit/:id" component={CompanyEditPage}/>
                <Route path="/fleet-owner/add" component={CompanyAddPage}/>
                <Route path="/fleet-owners" component={CompanyPage}/>
                <Route path="/vehicles" component={VehiclePage}/>
                <Route path="/drivers" component={DriverPage}/>
                <Route path="/user/profile" component={profileUpdatePage}/>
                {/* <Route path="/trips" component={TripPage}/> */}
                <Route path="/plans/add" component={PlanAddPage}/>
                <Route path="/plans/edit/:id" component={PlanEditPage}/>
                <Route path="/plans" component={PlanPage}/>
                <Route path="/feedback" component={Feedback}/>
                <Route path="/employees" component={EmployeePage}/>
                <Route path="/employee/add" component={EmployeeAddPage}/>
                <Route path="/employee/edit/:id" component={EmployeeEditPage}/>
                {/* aboutus */}
                <Route path="/aboutus" component={AboutPage}/>
                <Route path="/tracking" component={LiveLocationTracking}/>
                <Route path="/faqs" component={Faqpage}/>
                <Route path="/faq/add" component={FaqAddPage}/>
                <Route path="/faq/edit/:id" component={FaqEditPage}/>
                <Route path="/supports" component={SupportPage}/>
                {/* <Route path="/tracking" component={LiveLocationTracking}/> */}
                <Route path="/reports" component={ReportPage}/>
                <Route path="/vehicleDetails/:id" component={VehicleDetails}/>
                <Route path="/map/:id" component={VehicleMap}/>
                <Redirect to="error/error-v1"/>
            </Switch>
        </Suspense>
    );
}
