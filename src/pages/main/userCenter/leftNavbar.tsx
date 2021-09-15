import React from 'react';

import {UserCenterNavigateArray} from "@/config/navigateConfig";
import classnames from '@/utils/classnames';

import "./leftNavbar.less";

interface Props {
    navigateLabelArray: UserCenterNavigateArray
    selectedId: number
    setSelectedId: (id: number) => void
}

const LeftNavbar: React.FC<Props> = (props) => {
    const {navigateLabelArray, setSelectedId, selectedId} = props

    const renderNavbar = navigateLabelArray?.map((item, index) => {
        const {name, id, isVisible, icon} = item

        const typeOfIcon = (iconParam: typeof icon) => {
            const innerType = typeof iconParam
            if (innerType === "string") {
                return <img src={iconParam as string} alt="icon"/>
            } else if (innerType === "function") {
                return React.createElement(iconParam)
            }
        }

        return isVisible && <div
            className={classnames(
                "left-navbar-item",
                {"left-navbar-selected": id === selectedId}
            )}
            onClick={() => {
                setSelectedId(id)
            }}
            key={id}
        >
            <span className="left-navbar-item-icon">
                {typeOfIcon(icon)}
            </span>
            <span>
                {name}
            </span>
        </div>
    })

    return (
        <div className="left-navbar-container">
            {renderNavbar}
        </div>
    )
};

export default LeftNavbar;