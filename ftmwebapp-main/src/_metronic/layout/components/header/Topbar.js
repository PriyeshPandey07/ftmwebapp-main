import React, { useMemo } from "react";
import objectPath from "object-path";
import { NavLink } from "react-router-dom";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { QuickUserToggler } from "../extras/QuiclUserToggler";
import {SubHeader} from "./../subheader/SubHeader";

export function Topbar() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      viewSearchDisplay: objectPath.get(
        uiService.config,
        "extras.search.display"
      ),
      viewNotificationsDisplay: objectPath.get(
        uiService.config,
        "extras.notifications.display"
      ),
      viewQuickActionsDisplay: objectPath.get(
        uiService.config,
        "extras.quick-actions.display"
      ),
      viewCartDisplay: objectPath.get(uiService.config, "extras.cart.display"),
      viewQuickPanelDisplay: objectPath.get(
        uiService.config,
        "extras.quick-panel.display"
      ),
      viewLanguagesDisplay: objectPath.get(
        uiService.config,
        "extras.languages.display"
      ),
      viewUserDisplay: objectPath.get(uiService.config, "extras.user.display"),
    };
  }, [uiService]);

  return (
    <div className="topbar">
      {/* <SubHeader /> */}
      <div
        id="kt_header_menu"
        className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
        {...layoutProps.headerMenuAttributes}
      >
        <ul className={`menu-nav ${layoutProps.ulClasses} onboarding`}>
          <li className={`menu-item menu-item-rel`}>
              <NavLink className="menu-link" target="_blank" rel="noopener noreferrer" to="/client-onboarding">
                  <span className="menu-text">Client Onboarding</span>
              </NavLink>
          </li>
          <li className={`menu-item menu-item-rel`}>
              <NavLink className="menu-link" target="_blank" rel="noopener noreferrer" to="/vehicle-onboarding">
                  <span className="menu-text">Vehicle Onboarding</span>
              </NavLink>
          </li>
        </ul>
      </div>
      {layoutProps.viewUserDisplay && <QuickUserToggler />}
    </div>
  );
}
