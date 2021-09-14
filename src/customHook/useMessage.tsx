import React from 'react';
import useLocalStorage from "@/customHook/useLocalStorage";
import {createMessage, createMessageParams} from '@/api/v1/message';
import {showToast} from "@/utils/lightToast";

const useMessage = () => {
    const [getLocalStorage] = useLocalStorage()

    const sendMessage = (params: createMessageParams) => {
        const loginUserId = Number(getLocalStorage("userId"))
        const {communityId, replyId, commentId, toUserId} = params
        if (toUserId === loginUserId) return
        createMessage({
            ...params,
            fromUserId: loginUserId
        }).then(res => {
            if (res.status === 200) {
                showToast("已通知")
            }
        })
    }

    return sendMessage
};

export default useMessage;