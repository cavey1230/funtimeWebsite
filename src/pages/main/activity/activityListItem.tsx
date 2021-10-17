import React, {useEffect, useState} from 'react';
import classnames from "@/utils/classnames";

import "./activityListItem.less";
import {useHistory} from "react-router-dom";

interface Props {
    item: { [key: string]: any }
    index: number
    key: number
}

const ActivityListItem: React.FC<Props> = (props) => {
    const {item, index} = props

    const {
        id, createTime, name, startTime, endTime,
        recommend, rule, mainImg, bannerUrl,
        address, isOutTime, participatorNum,
        target
    } = item

    const [expireTime, setExpireTimer] = useState("")

    const history = useHistory()

    useEffect(() => {
        remainTime(isOutTime === 0, endTime)
    }, [])

    useEffect(() => {
        let outTimeId: NodeJS.Timer
        outTimeId = setTimeout(() => {
            remainTime(isOutTime === 0, endTime)
        }, 60000)
        return () => {
            clearInterval(outTimeId)
        }
    }, [expireTime])

    const remainTime = (isExpire: boolean, date: string) => {
        const replaceTime = date?.replace(/-/g, '/')
        const endTime = new Date(replaceTime).getTime()
        const nowTimeUnix = new Date().getTime()
        const distanceHours = ((endTime - nowTimeUnix) / 360_0000)
        const hours = Math.floor(distanceHours)
        const minute = Math.ceil((distanceHours - hours) * 60)
        setExpireTimer(`${hours}小时${minute}分钟`)
    }

    return <div
        className={classnames(
            "activity-list-item", {
                "isExpired": isOutTime > 0
            }
        )}
        onClick={() => {
            history.push(`/main/activity/details/${id}`)
        }}
    >
        <div className="name">
            {name}
        </div>
        <div className="banner">
            <img src={bannerUrl} alt="bannerUrl"/>
        </div>
        <div className="target-And-participator-num">
            <div className="target">
                {target?.map((item: string, index: number) => {
                    return <div className="target-item" key={index}>
                        {item}
                    </div>
                })}
            </div>
            <div className="participator-num">
                {participatorNum > 0 && <div>
                    <strong>参与人数:</strong>{participatorNum}
                </div>}
            </div>
        </div>
        <div className="recommend">
            {recommend}
        </div>
        <div className="time">
            <div>
                <span>开始时间</span>
                <span>{startTime}</span>
            </div>
            <div>
                <span>结束时间</span>
                <span>{endTime}</span>
            </div>
        </div>
        {isOutTime === 0 && <div className="expireTimer">
            <div>剩余时间</div>
            <div>{expireTime}</div>
        </div>}
    </div>
};

export default ActivityListItem;