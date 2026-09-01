/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {useSelector} from "react-redux";
import objectPath from "object-path";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import {UserProfileDropdown} from "./dropdowns/UserProfileDropdown";

export function QuickUserToggler() {
  const {user} = useSelector(state => state.auth.user);
  console.log('user ', user)
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas: objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    };
  }, [uiService]);

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
      <span>{initials}</span>
    );
  };

  return (<>
        {layoutProps.offcanvas && (<OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}
        >
          <div className="topbar-item">
            <div className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
                 id="kt_quick_user_toggle">
              <>

                {/* <span className="text-muted font-weight-bold font-size-base d-none d-md-inline mr-1">Hi,</span> */}
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-3">
                  {user.fullname}
                </span>
                <span className="symbol symbol-35 symbol-light-success">                
                {user.photo ? <div className="symbol-label" style={{
                backgroundImage: `url(${user.photo})`
              }}/>:  <div className="symbol-label"><NameComponent name={user.fullname}/></div>}
                </span>
              </>
            </div>
          </div>
        </OverlayTrigger>)}

        {!layoutProps.offcanvas && (<UserProfileDropdown/>)}
      </>
  );
}
