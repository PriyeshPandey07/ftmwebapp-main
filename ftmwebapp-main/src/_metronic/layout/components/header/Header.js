import React, {useMemo, useLayoutEffect, useEffect} from "react";
import objectPath from "object-path";
import {useLocation} from "react-router-dom";
import {BreadCrumbs} from "./components/BreadCrumbs";
import {useHtmlClassService} from "../../_core/MetronicLayout";
import {Topbar} from "./Topbar";
import {HeaderMenuWrapper} from "./header-menu/HeaderMenuWrapper";
import {AnimateLoading} from "../../../_partials/controls";
import {getBreadcrumbsAndTitle, useSubheader} from "../../_core/MetronicSubheader";
// import { SubHeader } from "../subheader/SubHeader";

export function Header() {
  const uiService = useHtmlClassService();
  const location = useLocation();
  const subheader = useSubheader();
  const layoutProps = useMemo(() => {
    return {
      headerClasses: uiService.getClasses("header", true),
      headerAttributes: uiService.getAttributes("header"),
      headerContainerClasses: uiService.getClasses("header_container", true),
      menuHeaderDisplay: objectPath.get(
        uiService.config,
        "header.menu.self.display"
      ),
      subheaderMobileToggle: objectPath.get(
        uiService.config,
        "subheader.mobile-toggle"
      ),
      subheaderCssClasses: uiService.getClasses("subheader", true),
      subheaderContainerCssClasses: uiService.getClasses(
          "subheader_container",
          true
      )
    };
  }, [uiService]);

  return (
    <>
      {/*begin::Header*/}
      <div
        className={`header ${layoutProps.headerClasses}`}
        id="kt_header"
        {...layoutProps.headerAttributes}
      >
        {/*begin::Container*/}
        <div className={` ${layoutProps.headerContainerClasses} d-flex align-items-stretch justify-content-between`}>
          <AnimateLoading />
          {/*begin::Header Menu Wrapper*/}
          {layoutProps.menuHeaderDisplay && <HeaderMenuWrapper />}
          {!layoutProps.menuHeaderDisplay && <div />}
          {/*end::Header Menu Wrapper*/}
          {/* <div
              id="kt_subheader"
              className={`subheader py-2 py-lg-4 ${layoutProps.subheaderCssClasses}`}
          >
            <div
                className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}
            >
              <div className="d-flex align-items-center flex-wrap mr-1">
                {layoutProps.subheaderMobileToggle && (
                    <button
                        className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
                        id="kt_subheader_mobile_toggle"
                    >
                      <span/>
                    </button>
                )}

                <div className="d-flex align-items-baseline mr-5">
                  <h5 className="text-dark font-weight-bold my-2 mr-5">
                    <>
                      {subheader.title}
                    </>
                  </h5>
                </div>
                <BreadCrumbs items={subheader.breadcrumbs} />
              </div>
            </div>
          </div> */}
          <Topbar />
        </div>
        {/*end::Container*/}
      </div>
      {/*end::Header*/}
    </>
  );
}
