import React, {useCallback, useEffect, useState} from 'react';
import Modal from "@/basicComponent/Modal";
import {getFansList, getFocusList} from "@/api/v1/fansAndFocus";
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";
import useLocalStorage from "@/customHook/useLocalStorage";
import FocusButton from "@/pages/main/publicComponent/focusButton";
import Pagination from '@/basicComponent/Pagination';

import "./fansAndFocusModal.less";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

export interface Props {
    model: "fans" | "focus"
    visible: boolean
    setVisible: (bool: boolean) => void
    userId: number
}

const FansAndFocusModal: React.FC<Props> = (props) => {
    const {model, visible, setVisible, userId} = props

    const [total, setTotal] = useState(0)

    const [list, setList] = useState([])

    const [getLocalStorage] = useLocalStorage()

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    const [pagination, setPagination] = useState({
        pageSize: isMobile ? 8 : 6,
        pageNum: 1
    })

    useEffect(() => {
        if (visible) {
            getData(model)
        }
    }, [visible, pagination, model])

    const getData = (model: Props["model"]) => {
        const loginUserId = getLocalStorage("userId")
        const {pageSize, pageNum} = pagination
        const data = {
            pageSize, pageNum,
            toUserId: userId,
            loginUserId: loginUserId
        }
        const promise = model === "fans" ? getFansList(data) : getFocusList(data)
        promise.then(res => {
            res.status === 200 && setList(res.data.data)
            res.status === 200 && setTotal(res.data.total)
        })
    }

    const renderList = useCallback((arr: Array<any>) => {
        return arr?.map(item => {
            const {targetUserAvatar, userId, nickname, id, focusStatus, recommend} = item
            return <div key={id} className="personal-home-modal-list-item">
                <PublicAvatar
                    flexMod={"row"}
                    avatarAddress={targetUserAvatar}
                    labelString={nickname}
                    justifyContent={"flex-start"}
                    alignItem={"center"}
                    mobileImgStyle={{width: "3rem"}}
                    pcImgStyle={{width: "5rem"}}
                    mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400", marginLeft: "0.5rem"}}
                    pcLabelStyle={{fontSize: "1.4rem", fontWeight: "600", marginLeft: "1rem"}}
                    expandModel={true}
                    targetUserId={userId}
                />
                <div>
                    <div className="recommend">
                        {recommend}
                    </div>
                    <div className="action-group">
                        <FocusButton
                            communityUserId={Number(userId)}
                            hasFocus={focusStatus}
                            flushData={() => {
                                getData(model)
                            }}
                        />
                    </div>
                </div>
            </div>
        })
    }, [])

    return (
        <Modal
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
            style={{
                minWidth: "30rem",
                minHeight: "60rem"
            }}
        >
            <div className="personal-home-modal-list-group">
                <div>
                    {renderList(list)}
                </div>
                <Pagination
                    pagination={pagination}
                    total={total}
                    setPagination={setPagination}
                    height={"6rem"}
                    layoutOptions={{
                        left: "25%",
                        center: "50%",
                        right: "25%"
                    }}
                />
            </div>
        </Modal>
    );
};

export default FansAndFocusModal;