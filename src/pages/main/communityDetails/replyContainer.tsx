import React, {useState} from 'react';
import Pagination from '@/basicComponent/Pagination';
import ReplyListItem from "@/pages/main/communityDetails//replyListItem";

import "./replyContainer.less";

interface Props {
    replyList: { [key: string]: string | number }[]
    total: number
    pagination: {
        pageSize: number
        pageNum: number
    }
    flushData: () => void
    setPagination: (pagination: Props["pagination"]) => void
    topicId: number
    selectReplyId: number
}

const ReplyContainer: React.FC<Props> = (props) => {

    const {replyList, total, flushData, pagination, setPagination, topicId, selectReplyId} = props

    const [actionBarVisible, setActionBarVisible] = useState({
        selectIndex: -1,
        visible: false
    })

    const renderReplyList = (replyList: Array<any>) => {
        return replyList?.map((item, index) => {
            return <ReplyListItem
                key={item.id}
                item={item}
                index={index}
                actionBarVisible={actionBarVisible}
                setActionBarVisible={setActionBarVisible}
                topicId={topicId}
                flushData={flushData}
                selectReplyId={selectReplyId}
            />
        })
    }

    return (
        <div className="reply-container">
            {renderReplyList(replyList)}
            <div className="reply-pagination-pad">
                <Pagination
                    total={total}
                    pagination={pagination}
                    setPagination={(pagination) => {
                        setActionBarVisible({
                            selectIndex: -1,
                            visible: false
                        })
                        setPagination(pagination)
                    }}
                    layoutOptions={{
                        left: "30%",
                        center: "40%",
                        right: "30%"
                    }}
                    height={"2rem"}
                />
            </div>
        </div>
    );
};

export default ReplyContainer;