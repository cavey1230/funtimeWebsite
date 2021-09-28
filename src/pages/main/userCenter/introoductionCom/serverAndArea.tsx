import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import Selector from "@/basicComponent/Selector";

import "./serverAndArea.less";

interface Props {
    serverList: Array<any>
    areaList: Array<any>
    initializeIdArray: Array<number>
    onChange?: (data: any) => void
}

const ServerAndArea: React.FC<Props & React.RefAttributes<any>> = forwardRef((
    props, ref
) => {
    const {serverList, areaList, initializeIdArray, onChange} = props

    const [serverId, setServerId] = useState(0)

    const [areaId, setAreaId] = useState(0)

    const [innerAreaNameList, setInnerAreaNameList] = useState(areaList)

    const selectorRef = useRef(null)

    useEffect(() => {
        setServerId(initializeIdArray[0])
        setAreaId(initializeIdArray[1])
    }, [initializeIdArray])

    useEffect(() => {
        selectorRef.current && selectorRef.current.init()
        const result = areaList.filter(item => item.serverId === serverId)
        serverId > 0 ? setInnerAreaNameList(result) : setInnerAreaNameList(areaList)
    }, [serverId, areaList])

    useEffect(() => {
        onChange && onChange((serverId && areaId) ? {server: serverId, area: areaId} : {})
    }, [serverId, areaId])

    useImperativeHandle(ref, () => ({
        setValue: () => {
            setServerId(0)
            setAreaId(0)
        },
        value: `${serverId},${areaId}`
    }))

    return (
        <div className="user-center-introduction-server-and-area">
            <Selector
                options={serverList}
                returnValueKey={"id"}
                labelKey={"name"}
                initializeValue={serverId}
                placeholder={"服务器"}
                onChange={(value) => {
                    setAreaId(0)
                    setServerId(value)
                }}
            />
            <Selector
                ref={selectorRef}
                rely={serverId}
                relyToastMessage={"请选择服务器"}
                options={innerAreaNameList}
                returnValueKey={"id"}
                labelKey={"name"}
                initializeValue={areaId}
                placeholder={"大区"}
                onChange={(value) => {
                    setAreaId(value)
                }}
            />
        </div>
    );
})

export default ServerAndArea;