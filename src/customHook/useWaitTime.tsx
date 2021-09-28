import React, {useEffect, useState} from 'react';
import useSessionStorage, {sessionType} from "@/customHook/useSessionStorage";


const useWaitTime = (waitTimeName: sessionType): [number, (data: number) => void] => {
    const [getSessionStorage] = useSessionStorage()

    const sessionWaitTime = getSessionStorage(waitTimeName) as number

    const [waitTime, setWaitTime] = useState(sessionWaitTime)

    useEffect(() => {
        let timeoutId: NodeJS.Timer
        if (waitTime > 0) {
            timeoutId = setTimeout(() => {
                setWaitTime(prevState => {
                    const value = prevState - 1
                    sessionStorage.setItem(waitTimeName, String(value))
                    return value
                })
            }, 1000)
        }
        return () => {
            clearTimeout(timeoutId)
        }
    }, [waitTime])

    return [waitTime, setWaitTime]
};

export default useWaitTime;