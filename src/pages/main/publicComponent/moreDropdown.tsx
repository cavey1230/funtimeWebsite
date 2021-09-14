import React, {useState} from 'react';
import Dropdown, {Props as DropdownProps} from "@/basicComponent/Dropdown";

import {MoreIcon} from "@/assets/icon/iconComponent";
import BannedModal from "@/pages/main/publicComponent/moreDropdownCom/bannedModal";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

import "./moreDropdown.less";

interface Props {
    targetId: number
    dropdownPosition: DropdownProps["position"]
    bannedContentType: "comment" | "community" | "reply" | "userinfo" | "introduction"
}

const MoreDropdown: React.FC<Props> = (props) => {
    const {dropdownPosition, bannedContentType, targetId} = props

    const [expand, setExpand] = useState(false)

    const [bannedVisible, setBannedVisible] = useState(false)

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    return (
        <React.Fragment>
            <Dropdown
                model={isMobile ? "click" : 'hover'}
                expandStatus={expand}
                setExpandStatus={setExpand}
                onClick={() => {
                    setExpand(true)
                }}
                onMouseEnter={() => {
                    // console.log("我是avatar，我被执行了")
                }}
                position={dropdownPosition}
                timeDelay={100}
                label={<div className="more-dropdown-icon">
                    <MoreIcon/>
                </div>}>
                <div className="more-dropdown-container">
                    <div
                        className="more-dropdown-item"
                        onClick={() => {
                            setBannedVisible(true)
                        }}
                    >
                        举报
                    </div>
                </div>
            </Dropdown>
            {/*举报的模态框*/}
            <BannedModal
                targetId={targetId}
                bannedContentType={bannedContentType}
                visible={bannedVisible}
                setVisible={setBannedVisible}
            />
        </React.Fragment>
    );
}

export default MoreDropdown;