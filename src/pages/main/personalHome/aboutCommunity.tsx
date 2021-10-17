import React, {useEffect, useState} from 'react';

import {Tab} from "@/basicComponent/Tab";
import {getPersonalHomePageCommunity} from "@/api/v1/personalHome";
import useTimeChanger from "@/customHook/useTimeChanger";
import {useHistory} from "react-router-dom";
import {getMarkDownContent} from "@/utils/stringMatchingTool";

import "./aboutCommunity.less";

interface Props {
    maxTotal: number
    userId: number
    showCommunity: number
    showComment: number
    showReply: number
}

const AboutCommunity: React.FC<Props> = (props) => {
    const {userId, showCommunity, showComment, showReply} = props

    const [data, setData] = useState({
        community: [],
        comment: [],
        reply: []
    } as { [key: string]: Array<any> })

    const [selectId, setSelectId] = useState(0)

    const timeChanger = useTimeChanger()

    const history = useHistory()

    enum dataType {community, comment, reply}

    const labelArray = [{
        title: "最近动态",
        id: 0
    }, {
        title: "最近评论",
        id: 1
    }, {
        title: "最近回复",
        id: 2
    }]

    useEffect(() => {
        (showCommunity === 1 || showComment === 1 || showReply === 1) &&
        getPersonalHomePageCommunity({userId}).then(res => {
            res.status && setData(res.data)
        })
    }, [showCommunity, showComment, showReply])

    const renderList = (selectId: number) => {
        const key = dataType[selectId]
        const label = labelArray.find((item) => {
            return item.id === selectId
        }).title
        if (
            (key === "community" && showCommunity === 0) ||
            (key === "comment" && showComment === 0) ||
            (key === "reply" && showReply === 0)
        ) {
            return <div className="empty">
                <span>该用户已隐藏{label}</span>
            </div>
        }
        return data[key]?.map(item => {
            const {
                content, createTime, id,
                imgArray, isHeightOrderModel,
                communityId, replyToCommentId
            } = item
            return <div
                key={id}
                className="personal-home-page-community-item"
                onClick={() => {
                    key === "community" && history.push(`/main/details/${id}`)
                    key === "comment" && history.push(`/main/details/${communityId}/${id}/0`)
                    key === "reply" && history.push(`/main/details/${communityId}/${replyToCommentId}/${id}`)
                }}
            >
                {imgArray?.length > 0 && <div className="img-group">
                    {imgArray?.map((img: string, index: number) => {
                        return <div key={index} className="img-item">
                            <img src={img} alt="img"/>
                        </div>
                    })}
                </div>}
                <div
                    className="time-and-content"
                    style={{width: (!imgArray || imgArray?.length === 0) ? "100%" : null}}
                >
                    <div className="time">{timeChanger(createTime)}</div>
                    {isHeightOrderModel === 1 ? <div
                        className="content"
                    >
                        {getMarkDownContent(content)}
                    </div> : <div className="content">
                        {content?.length === 50 ?
                            getMarkDownContent(content) :
                            content
                        }
                    </div>}
                </div>
            </div>
        })
    }

    return (
        <React.Fragment>
            <Tab
                labelArr={labelArray}
                onChange={(selectId) => {
                    setSelectId(selectId)
                }}
                initializeSelectId={0}
                blockDisplay={true}
                allowScroll={true}
            >
                <div
                    id={String(selectId)}
                    className="personal-home-page-community-container"
                >
                    <div className="personal-home-page-community-group">
                        {renderList(selectId)}
                    </div>
                </div>
            </Tab>
        </React.Fragment>
    );
};

export default AboutCommunity;