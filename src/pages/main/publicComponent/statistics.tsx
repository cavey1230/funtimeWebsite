import React, {useEffect, useRef, useState} from 'react';

import "./statistics.less";
import {getUserCountNumber} from "@/api/v1/user";

interface Props {
    userId: number | string
    userCountParams?: {
        focusNum: number
        fansNum: number
        communityNum: number
    }
}

const Statistics: React.FC<Props> = (props) => {
    const {userId, userCountParams} = props

    const [userCount, setUserCount] = useState(userCountParams || {
        focusNum: 0,
        fansNum: 0,
        communityNum: 0
    })

    const fansAndFocusRef = useRef(null)

    useEffect(() => {
        !userCountParams && getUserCountNumber({userId: Number(userId)}).then(res => {
            res.status === 200 && fansAndFocusRef.current && setUserCount(res.result)
        })
    }, [])

    useEffect(() => {
        userCountParams && setUserCount(userCountParams)
    }, [userCountParams])

    const {focusNum, fansNum, communityNum} = userCount

    return (
        <div ref={fansAndFocusRef} className="fans-and-focus">
            <div>
                <span>粉丝</span>
                <span>{fansNum}</span>
            </div>
            <div>
                <span>关注</span>
                <span>{focusNum}</span>
            </div>
            <div>
                <span>动态</span>
                <span>{communityNum}</span>
            </div>
        </div>
    );
};

export default Statistics;