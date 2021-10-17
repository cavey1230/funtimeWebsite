import React, {useEffect, useState} from 'react';
import {Tab, TabProps} from "@/basicComponent/Tab";
import {MessageIcon} from "@/assets/icon/iconComponent";
import Badeg from "@/basicComponent/Badeg";
import {useSelector} from 'react-redux';
import {ReduxRootType} from "@/config/reducers";
import NormalMessage from './normalMessage';
import ImportantMessage from "@/pages/main/message/importantMessage";
import {useClearKeepaliveWithoutMessage} from "@/customHook/useKeepaliveNameControl";

import "./index.less";

const Index = () => {

    const [selectId, setSelectId] = useState(0)

    const noReadMessageNum = useSelector((state: ReduxRootType) => {
        return state.noReadMessageReducer
    })

    const [messageType, setMessageType] = useState([{
        title: "普通消息",
        id: 0,
        icon: <MessageIcon/>
    }, {
        title: "重要消息",
        id: 1,
        icon: <MessageIcon/>
    }] as TabProps["labelArr"])

    //页面缓存控制,激活当前页面时会卸载掉name为数组内字符串的缓存
    useClearKeepaliveWithoutMessage()

    useEffect(() => {
        messageTypeAppendIconWithBadeg(noReadMessageNum)
    }, [noReadMessageNum])

    const messageTypeAppendIconWithBadeg = (
        noReadMessageNum: ReduxRootType["noReadMessageReducer"]
    ) => {
        const {noReadNormalMessageNum, noReadImportantMessageNum} = noReadMessageNum
        messageType.forEach((item) => {
            const {id} = item
            item.icon = <Badeg
                targetNum={id === 0 ?
                    noReadNormalMessageNum :
                    noReadImportantMessageNum}
                left={"250%"}
                top={"-80%"}
            >
                <MessageIcon/>
            </Badeg>
        })
        setMessageType([...messageType])
    }

    return (
        <Tab
            labelArr={messageType}
            onChange={(selectId) => {
                setSelectId(selectId)
            }}
            initializeSelectId={0}
            blockDisplay={true}
            allowScroll={true}
        >
            <div
                id={String(selectId)}
                className="message-container"
            >
                {selectId == 0 ? <NormalMessage/> : <ImportantMessage/>}
            </div>
        </Tab>
    );
};

export default Index;