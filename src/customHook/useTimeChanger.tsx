import React from 'react';

const useTimeChanger = () => {

    const timeChanger = (date: string, revers?: boolean): string => {
        if (!date) return
        const replaceTime = date?.replace(/-/g, '/')
        const itemCreateTimeUnix = new Date(replaceTime).getTime()
        const nowTimeUnix = new Date().getTime()
        const distanceTimeUnix = revers ? (itemCreateTimeUnix - nowTimeUnix) :
            (nowTimeUnix - itemCreateTimeUnix)
        const distanceHours = revers ? (distanceTimeUnix / 360_0000) :
            (distanceTimeUnix / 360_0000)
        if (distanceHours > 24 && distanceHours < 48) {
            return "昨天"
        } else if (distanceHours >= 48 && distanceHours < 168) {
            return Math.floor(distanceHours / 24) + "天前"
        } else if (distanceHours >= 168) {
            return replaceTime
        } else if (distanceHours < 1) {
            const distanceMinutes = Math.ceil((nowTimeUnix - itemCreateTimeUnix) / 6_0000)
            return distanceMinutes + "分钟前"
        } else if (distanceHours > 1) {
            const floorHours = Math.floor(distanceHours)
            const detailsMinute = Math.ceil((distanceHours - floorHours) * 60)
            return floorHours + "小时" + detailsMinute + "分钟前"
        }
    }

    return timeChanger
};

export default useTimeChanger;