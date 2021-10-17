import React from 'react';
import {TopicIcon} from "@/assets/icon/iconComponent";

import "./topicList.less";

interface Props {
    topicList: Array<{
        id: number
        name: string
        weight: number
    }>
}

const TopicList: React.FC<Props> = (props) => {
    const {topicList} = props

    const renderList = (arr: typeof topicList) => {
        return arr?.map(item => {
            const {name, id} = item
            return <div
                key={id}
                className="topic-list-item"
            >
                <TopicIcon/>
                <div>
                    {name}
                </div>
            </div>
        })
    }

    return (
        <div className="topic-list-group">
            {renderList(topicList)}
        </div>
    );
}

export default TopicList;