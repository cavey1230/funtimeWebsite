import React, {CSSProperties, useCallback, useState} from 'react';
import Dropdown from "@/basicComponent/Dropdown";
import {useHistory} from "react-router-dom";
import {Props as DropdownProps} from "@/basicComponent/Dropdown";

import "./Avatar.less";

interface Props {
    flexModel: CSSProperties["flexDirection"]
    alignItem: CSSProperties["alignItems"]
    justifyContent: CSSProperties["justifyContent"]
    navigateAddress: string
    width: string
    labelStyle: { [key: string]: string | number }
    imgStyle: { [key: string]: string | number }
    labelString: string
    avatarAddress: string
    expandModel: boolean
    dropdownPosition: DropdownProps["position"]
}

const Avatar: React.FC<Partial<Props>> = (props) => {

    const {
        avatarAddress, flexModel, width, alignItem,
        justifyContent, labelString, labelStyle,
        children, expandModel, imgStyle,
        navigateAddress, dropdownPosition
    } = props

    const innerFlexDirection = flexModel ? flexModel : "row"

    const innerAlignItem = alignItem ? alignItem : "center"

    const innerJustifyContent = justifyContent ? justifyContent : "flex-start"

    const innerWidth = width ? width : "100%"

    const innerExpandModel = expandModel ? expandModel : false

    const innerLabelString = labelString ? labelString : "未知"

    const [expand, setExpand] = useState(false)

    const history = useHistory()

    const navigateTo = () => {
        // console.log(navigateAddress)
        navigateAddress && history.push(navigateAddress)
    }

    const AvatarGroup = useCallback(() => {
        return <div className="avatar-img" style={{
            flexDirection: innerFlexDirection,
            alignItems: innerAlignItem,
            height: imgStyle.width as any
        }}>
            <div className="img-container" onClick={navigateTo}>
                <img src={avatarAddress} alt="avatarAddress" style={imgStyle}/>
            </div>
            <div className="nickname" onClick={navigateTo} style={labelStyle}>
                {innerLabelString}
            </div>
        </div>
    }, [avatarAddress,innerLabelString])

    return (
        <div
            className="avatar-out-container"
            style={{
                width: innerWidth,
                justifyContent: innerJustifyContent
            }}
        >
            {innerExpandModel ? <Dropdown
                // model="click"
                expandStatus={expand}
                setExpandStatus={setExpand}
                onClick={() => {
                    // console.log("我被点击了")
                }}
                onMouseEnter={() => {
                    // console.log("我是avatar，我被执行了")
                }}
                position={dropdownPosition}
                label={<AvatarGroup/>}>
                {children}
            </Dropdown> : <AvatarGroup/>}
        </div>
    );
};

export default Avatar;