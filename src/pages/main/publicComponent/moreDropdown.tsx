import React, {useState} from 'react';
import Dropdown, {Props as DropdownProps} from "@/basicComponent/Dropdown";

import {MoreIcon} from "@/assets/icon/iconComponent";
import BannedModal from "@/pages/main/publicComponent/moreDropdownCom/bannedModal";
import ShareModal from "@/pages/main/publicComponent/moreDropdownCom/shareModal";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

import "./moreDropdown.less";

export interface Props {
    targetId: number
    dropdownPosition: DropdownProps["position"]
    contentType: "comment" | "community" | "reply" | "userinfo" | "introduction"
    data: Partial<{
        id: number
        content: string
        nickname: string
        avatar: string
        userId: number
        imgArray: string[]
        communityId: number
        commentId: number
    }>
    keepHideScrollY?: boolean
}

const MoreDropdown: React.FC<Props> = (props) => {
    const {dropdownPosition, contentType, targetId, data, keepHideScrollY} = props

    const [expand, setExpand] = useState(false)

    const [visibleObj, setVisibleObj] = useState({
        bannedVisible: false,
        shareVisible: false
    })

    const isMobile = useSelector((state: ReduxRootType) => {
        return state.windowResizeReducer.isMobile
    })

    const setVisible = (key: string, bool: boolean) => {
        setVisibleObj({
            ...visibleObj, [key]: bool
        })
    }

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
                            setVisible("bannedVisible", true)
                        }}
                    >
                        举报
                    </div>
                    <div
                        className="more-dropdown-item"
                        onClick={() => {
                            setVisible("shareVisible", true)
                        }}
                    >
                        分享
                    </div>
                </div>
            </Dropdown>
            {/*举报的模态框*/}
            <BannedModal
                keepHideScrollY={keepHideScrollY}
                targetId={targetId}
                bannedContentType={contentType}
                visible={visibleObj.bannedVisible}
                setVisible={() => {
                    setVisible("bannedVisible", false)
                }}
            />
            <ShareModal
                keepHideScrollY={keepHideScrollY}
                data={data}
                contentType={contentType}
                visible={visibleObj.shareVisible}
                setVisible={() => {
                    setVisible("shareVisible", false)
                }}
            />
        </React.Fragment>
    );
}

export default MoreDropdown;