import React, {useEffect, useState} from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import {TopicIcon} from "@/assets/icon/iconComponent";
import Modal from "@/basicComponent/Modal";

import "./topicModal.less";

interface Props {
    visible: boolean
    setVisible: () => void
    onSelected: (name: string, id: number) => void
    keepHideScrollY?:boolean
}

const TopicModal: React.FC<Props> = (props) => {

    const {onSelected, visible, setVisible,keepHideScrollY} = props

    const [topicList, setTopicList] = useState([])

    const [getLocalstorage] = useLocalStorage()

    useEffect(() => {
        const innerTopicList = getLocalstorage("topicList")
        setTopicList(innerTopicList as any)
    }, [])

    const renderTopicList = (list: typeof topicList) => {
        return list?.map((item, index) => {
            const {name, type, isOutdated, hotNum, id} = item
            return <div
                key={id}
                className="topic-item"
                onClick={() => {
                    onSelected(name, id)
                }}
            >
                <div className="topic-label">
                    <TopicIcon/>
                    <span>
                        {name}
                    </span>
                </div>
                <div className="topic-hot-num">
                    <span>
                         热度
                    </span>
                    <span>
                        {hotNum}
                    </span>
                </div>
            </div>
        })
    }

    return (
        <Modal
            visible={visible}
            disableDoubleClick={true}
            onClose={setVisible}
            keepHideScrollY={keepHideScrollY}
            style={{
                minWidth: "20rem",
                maxWidth: "30rem"
            }}
        >
            <div className="topic-pad">
                {topicList?.length > 0 && renderTopicList(topicList)}
            </div>
        </Modal>
    );
};

export default TopicModal;