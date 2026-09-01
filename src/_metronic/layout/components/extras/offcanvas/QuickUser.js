/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,no-undef */
import React from "react";
import SVG from "react-inlinesvg";
import {useSelector} from "react-redux";
import { useHistory } from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_helpers";

export function QuickUser() {
  const history = useHistory();
  const {user} = useSelector(state => state.auth.user);
  const logoutClick = () => {
    const toggle = document.getElementById("kt_quick_user_toggle");
    if (toggle) {
      toggle.click();
    }
    history.push("/logout");
  };
  
  const NameComponent = ({ name }) => {
    let initials;
    if (name.includes(' ')) {
      // If the name has a space, get the first character from the first and last name
      const [firstName, lastName] = name.split(' ');
      initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else {
      // If the name is a single name without space, get the first two characters
      initials = name.slice(0, 2);
    }
    
    return (
      <span className="font-size-h1-xxl">{initials}</span>
    );
  };

  return (
      <div id="kt_quick_user" className="offcanvas offcanvas-right offcanvas p-10">
        <div className="offcanvas-header d-flex align-items-center justify-content-between pb-5">
          <h3 className="font-weight-bold m-0">
            My Profile
          </h3>
          <a
              href="#"
              className="btn btn-xs btn-icon btn-light btn-hover-primary"
              id="kt_quick_user_close"
          >
            <i className="ki ki-close icon-xs text-muted"/>
          </a>
        </div>

        <div
            className="offcanvas-content pr-5 mr-n5"
        >
          <div className="d-flex align-items-center mt-5">
            <div
                className="symbol symbol-100 symbol-light-success mr-5"
            >
              {user.photo ? <div className="symbol-label" style={{
                backgroundImage: `url(${user.photo})`
              }}/>:  <div className="symbol-label"><NameComponent name={user.fullname}/></div>}
              <i className="symbol-badge bg-success"/>
            </div>
            <div className="d-flex flex-column">
              <p
                  className="font-weight-bold font-size-h5 text-dark-75 mb-0"
              >
              {user !== undefined && user !== null && user !== '' && user.fullname !== undefined && user.fullname !== null && user.fullname !=='' ? user.fullname : ""}
              </p>
              <div className="navi mt-2">
                <p className="navi-item mb-0">
                <span className="navi-link p-0 pb-2">
                  <span className="navi-icon mr-1">
                    <span className="svg-icon-lg svg-icon-primary">
                      <SVG
                          src={toAbsoluteUrl(
                              "/media/svg/icons/Communication/Mail-notification.svg"
                          )}
                      ></SVG>
                    </span>
                  </span>
                  <span className="navi-text text-muted">
                  {user !== undefined && user !== null && user !== '' && user.email !== undefined && user.email !== null && user.email !== '' ? user.email : ""}
                  </span>
                </span>
                </p>
              </div>
              {/* <Link to="/logout" className="btn btn-light-primary btn-bold">
                Sign Out
              </Link> */}
              <button className="btn btn-light-primary btn-bold" onClick={logoutClick}>Sign out</button>
            </div>
          </div>

          <div className="separator separator-dashed mt-8 mb-5"/>

          <div className="navi navi-spacer-x-0 p-0">
            <a href="/user/profile" className="navi-item">
              <div className="navi-link">
                <div className="symbol symbol-40 bg-light mr-3">
                  <div className="symbol-label">
                  <span className="svg-icon svg-icon-md svg-icon-success">
                    <SVG
                        src={toAbsoluteUrl(
                            "/media/svg/icons/General/Notification2.svg"
                        )}
                    ></SVG>
                  </span>
                  </div>
                </div>
                <div className="navi-text">
                  <div className="font-weight-bold">My Profile</div>
                  <div className="text-muted">
                    Account settings
                    {" "}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
  );
}
