import React from 'react';

import {userCenterNavigateArray} from "@/config/navigateConfig";
import LeftNavbar from "@/pages/main/userCenter/leftNavbar";
import BasicInfo from "@/pages/main/userCenter/basicInfo";
import FocusAndFansInfo from "@/pages/main/userCenter/focusAndFansInfo";
import {useHistory, useRouteMatch} from "react-router-dom";
import Introduction from "@/pages/main/userCenter/introduction";
import RecentlyLike from "@/pages/main/userCenter/recentlyLike";
import GenerateCard from "@/pages/main/userCenter/generateCard";
import getDom from "@/utils/getDom";
import PersonalHomeSetting from "@/pages/main/userCenter/personalHomeSetting";

import "./index.less";

const Index = () => {

    const match = useRouteMatch()

    const history = useHistory()

    const urlId = Number((match.params as any).id)

    const contentArray: Array<() => JSX.Element> = [
        BasicInfo,
        FocusAndFansInfo,
        Introduction,
        GenerateCard,
        RecentlyLike,
        PersonalHomeSetting
    ]

    return (
        <div className="user-center-container">
            <div className="user-center-left">
                <LeftNavbar
                    navigateLabelArray={userCenterNavigateArray}
                    selectedId={urlId}
                    setSelectedId={(id) => {
                        getDom("user-center-content-container").scrollTo({
                            top: 0,
                        })
                        history.push(`/main/userCenter/${id}`)
                    }}
                />
            </div>
            <div className="user-center-right">
                <div
                    id="user-center-content-container"
                >
                    {React.createElement(contentArray[urlId])}
                </div>
            </div>
        </div>
    );
};

export default Index;