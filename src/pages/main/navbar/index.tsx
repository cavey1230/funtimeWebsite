import React, {useEffect, useRef, useState} from 'react';

import Switch from "@/basicComponent/Switch";
import {useHistory} from "react-router-dom";
import UserActionBar from "@/pages/main/navbar/userActionBar";
import {useSelector} from "react-redux";
import {useAliveController} from 'react-activation';
import {ReduxRootType} from "@/config/reducers";

import whiteLogo from "@/assets/img/logo-white.png";
import blackLogo from "@/assets/img/logo-black.png";
import classnames from "@/utils/classnames";
import {navigateLabelArray} from "@/config/navigateConfig";

import "./index.less";
import Input from "@/basicComponent/Input";
import SearchInput from "@/pages/main/navbar/searchInput";

interface Props {
    skinStatus: boolean
    setSkinStatus: () => void
}

const Navbar: React.FC<Props> = ({setSkinStatus, skinStatus}) => {

    const navbarRef = useRef(null)

    const history = useHistory()

    const [current, setCurrent] = useState(() => {
        const matchRoute = navigateLabelArray.find(item => {
            return item.address === history.location.pathname
        })
        return matchRoute ? matchRoute.id : null
    })

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    const {clear} = useAliveController()

    useEffect(() => {
        let interValId: NodeJS.Timer
        let preScrollTop: number = 0
        const scrollFunc = () => {
            const nowScrollTop = document.body.scrollTop
            if (window.innerWidth > 576) {
                if ((nowScrollTop > preScrollTop)) {
                    navbarRef.current.style.top = "-7rem"
                    preScrollTop = nowScrollTop
                } else {
                    navbarRef.current.style.top = "0"
                    preScrollTop = nowScrollTop
                }
            }
        }
        document.body.addEventListener("scroll", scrollFunc)
        return () => {
            clearInterval(interValId)
            document.body.removeEventListener("scroll", scrollFunc)
        }
    }, [])

    const renderNavbarItem = (array: typeof navigateLabelArray) => {
        return array.map((item) => {
            const {name, id, address} = item
            return (<div
                key={id}
                className={classnames(
                    "navbar-item",
                    {"selected": current === id}
                )}
                onClick={() => {
                    id !== current && clear().then(() => {
                        // console.log("页面缓存清除成功")
                    })
                    setCurrent(id)
                    history.push(address)
                }}
            >
                <span>{name}</span>
            </div>)
        })
    }

    return (
        <div ref={navbarRef} className="navbar-out-container">
            <input type="checkbox" id="checkbox-expand" style={{display: "none"}}/>
            <label htmlFor="checkbox-expand" id="left-control-button" className="left-control-button">
                <div className="across"/>
                <div className="across"/>
                <div className="across"/>
            </label>
            {isMobile && <div className="mobile-user-actionbar">
                <SearchInput/>
                <UserActionBar/>
            </div>}
            <div className="navbar-inner-container">
                <div className="logo">
                    <img src={skinStatus ? whiteLogo : blackLogo} alt="logo"/>
                </div>
                <div className="navbar-out-group-container">
                    <div className="navbar-group-container">
                        {renderNavbarItem(navigateLabelArray)}
                    </div>
                </div>
                <div className="action-bar">
                    {!isMobile && <SearchInput/>}
                    <Switch
                        status={skinStatus}
                        setStatus={setSkinStatus}
                        labelArray={["暗", "光"]}
                    />
                    {!isMobile && <UserActionBar/>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;