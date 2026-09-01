import React, {useMemo, useLayoutEffect, useEffect} from "react";
import {useLocation} from "react-router-dom";
import objectPath from "object-path";
import {Link} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_helpers";
import {getBreadcrumbsAndTitle, useSubheader} from "../../../_core/MetronicSubheader";
import {useHtmlClassService} from "../../../_core/MetronicLayout";

export function HeaderMenuWrapper() {
    const uiService = useHtmlClassService();
    const location = useLocation();
    const subheader = useSubheader();
    const layoutProps = useMemo(() => {
        return {
            config: uiService.config,
            ktMenuClasses: uiService.getClasses("header_menu", true),
            rootArrowEnabled: objectPath.get(
                uiService.config,
                "header.menu.self.root-arrow"
            ),
            menuDesktopToggle: objectPath.get(uiService.config, "header.menu.desktop.toggle"),
            headerMenuAttributes: uiService.getAttributes("header_menu"),
            headerSelfTheme: objectPath.get(uiService.config, "header.self.theme"),
            ulClasses: uiService.getClasses("header_menu_nav", true),
            disabledAsideSelfDisplay: objectPath.get(uiService.config, "aside.self.display") === false,
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

    useLayoutEffect(() => {
        const aside = getBreadcrumbsAndTitle("kt_aside_menu", location.pathname);
        const header = getBreadcrumbsAndTitle("kt_header_menu", location.pathname);
        const breadcrumbs = (aside && aside.breadcrumbs.length > 0) ? aside.breadcrumbs : header.breadcrumbs;
        subheader.setBreadcrumbs(breadcrumbs);
        subheader.setTitle((aside && aside.title && aside.title.length > 0) ? aside.title : header.title);
        // eslint-disable-next-line
      }, [location.pathname]);

    // Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
    useEffect(() => {}, [subheader]);

    const getHeaderLogo = () => {
        let result = "logo-light.png";
        if (layoutProps.headerSelfTheme && layoutProps.headerSelfTheme !== "dark") {
            result = "logo-dark.png";
        }
        return toAbsoluteUrl(`/media/logos/${result}`);
    };

    return <>
        {/*begin::Header Menu Wrapper*/}
        <div className="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
            {layoutProps.disabledAsideSelfDisplay && (
                <>
                    {/*begin::Header Logo*/}
                    <div className="header-logo">
                        <Link to="/">
                            <img alt="logo" src={getHeaderLogo()}/>
                        </Link>
                    </div>
                    {/*end::Header Logo*/}
                </>
            )}
            <div
                className={`d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap h-100`}
            >
                <div className="d-flex align-items-center flex-wrap h-100 mr-1">
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
                    {/* <BreadCrumbs items={subheader.breadcrumbs} /> */}
                </div>
            </div>
        </div>
        {/*Header Menu Wrapper*/}
    </>
}
