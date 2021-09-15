import React, {useState} from 'react';

import {userCenterNavigateArray} from "@/config/navigateConfig";
import LeftNavbar from "@/pages/main/userCenter/leftNavbar";
import BasicInfo from "@/pages/main/userCenter/basicInfo";

import "./index.less";

const Index = () => {
    const [selectedId, setSelectedId] = useState(0)

    const contentArray: Array<JSX.Element> = [
        <BasicInfo/>
    ]

    return (
        <div className="user-center-container">
            <div className="user-center-left">
                <LeftNavbar
                    navigateLabelArray={userCenterNavigateArray}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                />
            </div>
            <div className="user-center-right">
                <div className="user-center-content-container">
                    {contentArray[0]}
                </div>
            </div>
        </div>
    );
};

export default Index;