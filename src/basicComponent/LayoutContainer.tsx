import React from 'react';

import useSkinStatus from "@/customHook/useSkinStatus";
import {useHistory} from "react-router-dom";
import Loading from "@/basicComponent/Loading";

import whiteLogo from "@/assets/img/logo-white.png";
import blackLogo from "@/assets/img/logo-black.png";

import "./LayoutContainer.less";

interface Props {
    backgroundTips?: boolean
    loadingVisible?: boolean
}

const LayoutContainer: React.FC<Props> = (props) => {
    const {backgroundTips, loadingVisible, children} = props

    const [_, skinStatus] = useSkinStatus()

    const history = useHistory()

    return (
        <div className={`layout-out-container`}>
            <div className="logo-container">
                <img onClick={() => {
                    history.push("/")
                }} src={skinStatus ? whiteLogo : blackLogo} alt="logo"/>
            </div>
            {backgroundTips && <div className="sides-container">
                <div><span>FunTime</span><span>业余论坛</span></div>
            </div>}
            <div className="layout-inner-container">
                <div className="layout-center-container">
                    {children}
                </div>
            </div>
            <Loading visible={loadingVisible}/>
        </div>
    );
};

export default LayoutContainer;