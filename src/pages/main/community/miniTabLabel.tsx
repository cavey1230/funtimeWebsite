import React from 'react';
import {TopicListItem} from "@/pages/main/community/index";
import {TopicIcon} from "@/assets/icon/iconComponent";
import classnames from "@/utils/classnames";

import "./miniTabLabel.less";

interface Props {
    selectTopicId: number
    setSelectTopicId: (data: number) => void
    labelArray: Array<TopicListItem>
}

const MiniTabLabel: React.FC<Props> = (props) => {
    const {setSelectTopicId, selectTopicId, labelArray} = props

    const getTopicObject = (topicList: TopicListItem[]) => {
        return topicList?.map(item => {
            const {name, id} = item
            return {
                title: name,
                id, icon: <TopicIcon/>
            }
        })
    }

    const renderLabel = (labelArr: Array<{
        title: string
        id: number
        icon?: string | JSX.Element
    }>) => {
        return labelArr?.map((item, index) => {
            const {id, title, icon} = item
            return <div
                className={classnames("community-label-pad-item", {
                    "community-selected": selectTopicId === id
                })}
                key={id}
                onClick={() => {
                    setSelectTopicId(id)
                }}
            >
                {icon && (typeof icon === "string" ?
                    <img src={icon} alt="icon"/> : React.cloneElement(icon as JSX.Element))}
                {title}
            </div>
        })
    }

    return (
        <div className="community-label-pad">
            {renderLabel(getTopicObject(labelArray))}
        </div>
    );
};

export default MiniTabLabel;