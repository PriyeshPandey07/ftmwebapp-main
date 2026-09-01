/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation, Redirect } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import PeopleOutlinedIcon from '@material-ui/icons/PeopleOutlined';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import MoneyOutlinedIcon from '@material-ui/icons/MoneyOutlined';
import AccountBoxOutlinedIcon from '@material-ui/icons/AccountBoxOutlined';
import SimCardOutlinedIcon from '@material-ui/icons/SimCardOutlined';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import HeadsetMicOutlinedIcon from '@material-ui/icons/HeadsetMicOutlined';
import LiveHelpOutlinedIcon from '@material-ui/icons/LiveHelpOutlined';
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";
import { useSelector } from "react-redux";


export function AsideMenuList({ layoutProps }) {
  const location = useLocation();
  const { user } = useSelector(({ auth }) => auth);
  const role = user ? user.user.role : null;

  const getMenuItemActive = (url, hasSubmenu = false) => {
    return checkIsActive(location, url)
      ? ` ${!hasSubmenu && "menu-item-active"} menu-item-open `
      : "";
  };

  if (role === "accounts" && !location.pathname.includes("/dashboard")) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      {/* begin::Menu Nav */}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
        {/*begin::1 Level*/}

        <li
          className={`menu-item ${getMenuItemActive("/dashboard", false)}`}
          aria-haspopup="true"
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="svg-icon menu-icon">
              <DashboardOutlinedIcon />
            </span>
            <span className="menu-text">Dashboard</span>
          </NavLink>
        </li>

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/users", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/users">
              <span className="svg-icon menu-icon">
                <PeopleOutlinedIcon />
              </span>
              <span className="menu-text">Users</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/employee", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/employees">
              <span className="svg-icon menu-icon">
                <PeopleOutlinedIcon />
              </span>
              <span className="menu-text">Employees</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : ( // Check the role before displaying "Fleet Owners" menu item
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/fleet-owners",
              true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/fleet-owners">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/owner.svg")} />
              </span>
              <span className="menu-text">Fleet Owners</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/sim-cards", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/sim-cards">
              <span className="svg-icon menu-icon">
                <SimCardOutlinedIcon />
              </span>
              <span className="menu-text">SIM Cards</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/devices", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/devices">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/magnetic-sensor.svg")} />
              </span>
              <span className="menu-text">Devices</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/vehicles", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/vehicles">
              <span className="svg-icon menu-icon">
                <LocalShippingOutlinedIcon />
              </span>
              <span className="menu-text">Vehicles</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/plans", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/plans">
              <span className="svg-icon menu-icon">
                <MoneyOutlinedIcon />
              </span>
              <span className="menu-text">Plans</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/reports", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/reports">
              <span className="svg-icon menu-icon">
                <AssessmentOutlinedIcon />
              </span>
              <span className="menu-text">Reports</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/supports", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/supports">
              <span className="svg-icon menu-icon">
               <HeadsetMicOutlinedIcon />
              </span>
              <span className="menu-text">Support</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/aboutus", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/aboutus">
              <span className="svg-icon menu-icon">
                <AccountBoxOutlinedIcon />
              </span>
              <span className="menu-text">AboutUs</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/faqs", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/faqs">
              <span className="svg-icon menu-icon">
                <LiveHelpOutlinedIcon />
              </span>
              <span className="menu-text">Faqs</span>
            </NavLink>
          </li>
        )}

        {["accounts"].includes(role) ? null : (
          <li
            className={`menu-item menu-item-submenu ${getMenuItemActive(
              "/feedback", true
            )}`}
            aria-haspopup="true"
          >
            <NavLink className="menu-link" to="/feedback">
              <span className="svg-icon menu-icon">
                <SVG src={toAbsoluteUrl("/media/svg/icons/rating.svg")} />
              </span>
              <span className="menu-text">Feedback</span>
            </NavLink>
          </li>
        )}
        {/* <li
              className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/e-commerce", true
              )}`}
              aria-haspopup="true"
              data-menu-toggle="hover"
          >
            <NavLink className="menu-link menu-toggle" to="/e-commerce">
            <span className="svg-icon menu-icon">
              <SVG src={toAbsoluteUrl("/media/svg/icons/Shopping/Bag2.svg")}/>
            </span>
              <span className="menu-text">eCommerce</span>
            </NavLink>
            <div className="menu-submenu">
              <i className="menu-arrow"/>
              <ul className="menu-subnav">
                <li className="menu-item menu-item-parent" aria-haspopup="true">
                <span className="menu-link">
                  <span className="menu-text">eCommerce</span>
                </span>
                </li>
                <li
                    className={`menu-item ${getMenuItemActive(
                        "/e-commerce/customers"
                    )}`}
                    aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/e-commerce/customers">
                    <i className="menu-bullet menu-bullet-dot">
                      <span/>
                    </i>
                    <span className="menu-text">Customers</span>
                  </NavLink>
                </li>
                <li
                    className={`menu-item ${getMenuItemActive(
                        "/e-commerce/products"
                    )}`}
                    aria-haspopup="true"
                >
                  <NavLink className="menu-link" to="/e-commerce/products">
                    <i className="menu-bullet menu-bullet-dot">
                      <span/>
                    </i>
                    <span className="menu-text">Products</span>
                  </NavLink>
                </li>
              </ul>
            </div>
          </li> */}
      </ul>
      {/* end::Menu Nav */}
    </>
  );
}
