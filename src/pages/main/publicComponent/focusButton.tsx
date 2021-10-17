import React from 'react';
import Button from "@/basicComponent/Button";
import useLocalStorage from "@/customHook/useLocalStorage";
import {cancelFocus, createFocus} from "@/api/v1/fansAndFocus";
import {confirm} from "@/basicComponent/Confirm";

interface Props {
    communityUserId: number
    hasFocus: number
    flushData: (userId: number) => void
}

const FocusButton: React.FC<Props> = (props) => {

    const {communityUserId, hasFocus, flushData} = props

    const [getLocalStorage] = useLocalStorage()

    const cancelOrFocus = (type: number) => {
        const loginUserId = Number(getLocalStorage("userId"))
        if (!loginUserId) return
        let innerPromise: Promise<any>
        innerPromise = type === 0 ? cancelFocus({
            followUserId: loginUserId,
            targetUserId: communityUserId
        }) : createFocus({
            followUserId: loginUserId,
            targetUserId: communityUserId
        })
        innerPromise.then(res => {
            if (res.status === 200) {
                flushData(loginUserId)
            }
        })
    }

    const aboutFocusStatusReturnComponent = () => {
        const loginUserId = Number(getLocalStorage("userId"))
        if (communityUserId === loginUserId || !loginUserId) {
            return
        } else if (hasFocus === 0) {
            return <Button
                onClick={() => {
                    cancelOrFocus(1)
                }}
            >
                关注
            </Button>
        } else if (hasFocus === 1 || hasFocus === 2) {
            return <Button onClick={() => {
                confirm({
                    title: "取消关注?",
                    content: "取消关注?",
                    onCancel: () => {

                    },
                    onClick: () => {
                        cancelOrFocus(0)
                    },
                    onClickText: "确认",
                    onCancelText: "取消"
                })
            }}>
                {hasFocus === 1 ?
                    "已关注" : hasFocus === 2 ?
                        "已互粉" : "关注"}
            </Button>
        }
    }

    return (
        <React.Fragment>
            {aboutFocusStatusReturnComponent()}
        </React.Fragment>
    );
};

export default FocusButton;