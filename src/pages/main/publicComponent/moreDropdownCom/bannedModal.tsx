import React, {useEffect, useRef, useState} from 'react';

import Modal from "@/basicComponent/Modal";
import Input from "@/basicComponent/Input";
import Button from '@/basicComponent/Button';
import {createBannedLog, getReasonList} from "@/api/v1/banned";
import {RightArrowIcon} from "@/assets/icon/iconComponent";
import useLocalStorage from "@/customHook/useLocalStorage";
import {showToast} from "@/utils/lightToast";

import "./bannedModal.less";

interface Props {
    visible: boolean
    setVisible: () => void
    bannedContentType: "comment" | "community" | "reply" | "userinfo" | "introduction"
    targetId: number
    keepHideScrollY?: boolean
}

export const bannedContentTypeWithChinese = {
    comment: "评论",
    community: "动态",
    reply: "回复",
    userinfo: "个人信息",
    introduction: "个人情报",
}

const BannedModal: React.FC<Props> = (props) => {
    const {visible, setVisible, bannedContentType, targetId, keepHideScrollY} = props

    const [bannedReasonList, setBannedReasonList] = useState([])

    const [bannedChildrenReasonList, setBannedChildrenReasonList] = useState([])

    const [reasonForLevel2, setReasonForLevel2] = useState(false)

    const [selectReason, setSelectReason] = useState("")

    const inputRef = useRef(null)

    const [getLocalStorage] = useLocalStorage()

    useEffect(() => {
        visible && getReasonList({reportBannedType: bannedContentType}).then(res => {
            res.status === 200 && setBannedReasonList(res.data)
            res.status !== 200 && setVisible()
        })
    }, [visible])

    const renderBannedReasonItem = (bannedReasonList: Array<any>) => {
        return bannedReasonList?.map((item, index) => {
            const {bannedReason, childrenList} = item
            const {reasonContent, id} = bannedReason
            return <div
                className="banned-reason-item"
                key={id}
                onClick={() => {
                    if (childrenList.length > 0) {
                        setBannedChildrenReasonList(childrenList)
                        setReasonForLevel2(true)
                    } else {
                        setSelectReason(reasonContent)
                    }
                }}
            >
                <span className="label">{reasonContent}</span>
                {childrenList.length > 0 && <span className="icon">
                    <RightArrowIcon/>
                </span>}
            </div>
        })
    }

    const renderReasonGroup = () => {
        if (selectReason.length > 0) {
            return <div>
                <div>
                    <span>你已选择</span>
                    <span style={{marginLeft: "1rem"}}>
                        {selectReason}
                    </span>
                </div>
                <Button style={{margin: "1rem auto", width: "50%"}} onClick={() => {
                    setSelectReason("")
                }}>
                    重新选择
                </Button>
            </div>
        }
        if (!reasonForLevel2) {
            return renderBannedReasonItem(bannedReasonList)
        } else {
            return <div>
                {renderBannedReasonItem(bannedChildrenReasonList)}
                <Button style={{margin: "1rem auto", width: "50%"}} onClick={() => {
                    setReasonForLevel2(false)
                }}>
                    返回父级
                </Button>
            </div>
        }
    }

    const commitBannedReason = () => {
        if (!selectReason) {
            showToast("请选择举报原因", "error")
            return
        }
        const userId = getLocalStorage("userId")
        createBannedLog({
            type: bannedContentType,
            targetId: targetId,
            commitUserId: userId,
            reason: selectReason,
            customReason: inputRef.current.value
        }).then(res => {
            if (res.status === 200) {
                showToast("举报成功")
                setVisible()
            }
        })
    }

    return (
        <Modal
            style={{minWidth: "20rem", maxWidth: "30rem"}}
            visible={visible}
            onClose={() => setVisible()}
            keepHideScrollY={keepHideScrollY}
        >
            <div className="banned-modal-out-container">
                <div className="banned-modal-label">
                    <div>请帮助我们了解情况</div>
                    <div>为什么你不希望看到这条{bannedContentTypeWithChinese[bannedContentType]}</div>
                </div>
                <div className="banned-reason-group">
                    {renderReasonGroup()}
                </div>
                <div className="banned-modal-label">
                    <div>有其他原因</div>
                </div>
                <div className="other-reason">
                    <Input
                        ref={inputRef}
                        style={{border: "none", maxHeight: "8rem"}}
                        placeholder={"请描述举报理由"}
                        textAreaMode={true}
                        noFocusStyle={true}
                        onChange={() => {
                            //此处不做处理
                        }}
                    />
                </div>
                <div className="banned-reason-action-pad">
                    <Button
                        onClick={() => {
                            commitBannedReason()
                        }}
                        style={{margin: "1rem 0"}}
                    >
                        提交
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default BannedModal;