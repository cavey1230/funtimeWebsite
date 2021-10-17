import React, {useEffect, useRef, useState} from 'react';
import {getParticipator} from "@/api/v1/activity";
import useLocalStorage from "@/customHook/useLocalStorage";
import Loading from "@/basicComponent/Loading";
import useGetNameList from "@/customHook/useGetNameList";
import {getNameById} from '../introduction/introductionList';
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import classnames from '@/utils/classnames';

import "./participatorList.less";

interface Props {
    activityId: number
}

const ParticipatorList: React.FC<Props> = (props) => {
    const {activityId} = props

    const nameList = useGetNameList()

    const [list, setList] = useState([])

    const [selectIndex, setSelectIndex] = useState(0)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [getLocalStorage] = useLocalStorage()

    const containerRef = useRef(null)

    const userId = getLocalStorage("userId")

    useEffect(() => {
        setLoadingVisible(true)
        getParticipator({
            activityId,
            participatorId: userId,
            offset: 20
        }).then(res => {
            res.status === 200 && setList(res.data)
            setLoadingVisible(false)
        })
    }, [])

    useEffect(() => {
        const innerTimeoutId = setTimeout(() => {
            if (list?.length >= 2) {
                const dom = containerRef.current
                dom.scrollTo({
                    top: selectIndex === list.length - 1 ? 0 :
                        dom.scrollTop + 100
                })
                selectIndex === list.length - 1 ? setSelectIndex(0) :
                    setSelectIndex(selectIndex + 1)
            }
        }, 5000)
        return () => {
            clearTimeout(innerTimeoutId)
        }
    }, [list, selectIndex, containerRef])

    const {server: serverList, area: areaList} = nameList

    const renderParticipatorList = (arr: Array<any>, selectIndex: number) => {
        return list?.map((item, index) => {
            const {
                id, server, area, avatar,
                nickname, participatorId, gameRoleName
            } = item
            return <div
                key={id}
                className={classnames("participator-list-item", {
                    "participator-list-item-selected": selectIndex === index
                })}
            >
                <PublicAvatar
                    avatarAddress={avatar}
                    labelString={nickname}
                    justifyContent={"flex-start"}
                    alignItem={"center"}
                    mobileImgStyle={{width: "3rem"}}
                    pcImgStyle={{width: "5rem"}}
                    mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400", marginLeft: "1rem"}}
                    pcLabelStyle={{fontSize: "1.6rem", fontWeight: "600", marginLeft: "1rem"}}
                />
                <div className="game-info">
                    <div>
                        {getNameById(serverList, server)}
                    </div>
                    <div>
                        {getNameById(areaList, area)}
                    </div>
                    <div>
                        {gameRoleName}
                    </div>
                </div>
            </div>
        })
    }

    return (
        <React.Fragment>
            {list?.length >= 2 && <div
                className="participator-list-container"
                ref={containerRef}
            >
                {renderParticipatorList(list, selectIndex)}
            </div>}
            <Loading visible={loadingVisible}/>
        </React.Fragment>

    );
};

export default ParticipatorList;