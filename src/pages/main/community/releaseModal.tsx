import React from 'react';
import Modal from "@/basicComponent/Modal";
import ActionBar from "@/pages/main/community/actionBar";
import {TopicListItem} from '.';
import MiniTabLabel from "@/pages/main/community/miniTabLabel";
import Screening from "@/basicComponent/Screening";

import "./releaseModal.less";

interface ReleaseModalProps {
    reloadData: () => void
    setVisible: () => void
    visible: boolean
}

export const ReleaseModal: React.FC<ReleaseModalProps> = (props) => {
    const {
        reloadData, setVisible, visible
    } = props

    return (
        <Modal
            visible={visible}
            keepHideScrollY={true}
            onClose={() => {
                setVisible()
            }}
            style={{
                minWidth: "30rem",
                height:"initial"
            }}
        >
            <div className="action-bar-container">
                <ActionBar flushDataFunc={() => {
                    reloadData()
                }}/>
            </div>
        </Modal>
    );
};

interface TopicModalProps {
    labelArray: Array<TopicListItem>
    selectTopicId: number
    setSelectTopicId: (data: number) => void
    setVisible: () => void
    visible: boolean
}

export const TopicModal: React.FC<TopicModalProps> = (props) => {
    const {
        labelArray, setSelectTopicId, selectTopicId,
        setVisible, visible
    } = props

    return (
        <Modal
            visible={visible}
            keepHideScrollY={true}
            onClose={() => {
                setVisible()
            }}
            style={{
                minWidth: "30rem",
            }}
        >
            <div className="action-bar-container">
                <MiniTabLabel
                    selectTopicId={selectTopicId}
                    setSelectTopicId={setSelectTopicId}
                    labelArray={labelArray}
                />
            </div>
        </Modal>
    );
};

interface ScreenModalProps {
    containerRef: React.RefObject<any>
    setFillHeight: (num: number | string) => void
    setCondition: (array: Array<any>) => void
    initializeData:Array<any>
    setVisible: () => void
    visible: boolean
}

export const ScreenModal: React.FC<ScreenModalProps> = (props) => {
    const {
        containerRef, setFillHeight, setCondition,
        setVisible, visible,initializeData
    } = props

    return (
        <Modal
            visible={visible}
            keepHideScrollY={true}
            onClose={() => {
                setVisible()
            }}
            style={{
                minWidth: "30rem",
                height:"15rem"
            }}
        >
            <div className="action-bar-container">
                <Screening
                    initializeData={initializeData}
                    setCondition={(array) => {
                        if(initializeData[1] !== array[1]){
                            const offsetHeight = containerRef.current.offsetHeight
                            setFillHeight(offsetHeight)

                            setCondition([...array])
                            setTimeout(() => {
                                setFillHeight("100%")
                            }, 500)
                        }
                    }}
                    labelArray={[{
                        name: "时间",
                        key: "timeControl"
                    }, {
                        name: "查看数",
                        key: "watchControl"
                    }, {
                        name: "喜欢数",
                        key: "likeControl"
                    }, {
                        name: "评论数",
                        key: "messageControl"
                    }]}
                />
            </div>
        </Modal>
    );
};