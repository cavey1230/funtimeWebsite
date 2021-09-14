import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {getCommentList, getCommentPageNum} from "@/api/v1/community";
import usePagination from "@/customHook/usePagination";
import CommentListItem from "@/pages/main/communityDetails/commentListItem";
import Screening from "@/basicComponent/Screening";
import Loading from "@/basicComponent/Loading";

import "./commentContainer.less";

interface Props {
    communityId: number
    topicId: number
    ref: any
    selectCommentId: number
    selectReplyId: number
}

const CommentContainer: React.FC<Props> = forwardRef((props, ref: React.Ref<unknown>) => {
    const {communityId, topicId, selectCommentId, selectReplyId} = props

    const [commentList, setCommentList] = useState([])

    const [actionBarVisible, setActionBarVisible] = useState({
        selectIndex: -1,
        visible: false
    })

    const [commentTotal, setCommentTotal] = useState(0)

    const [condition, setCondition] = useState([] as Array<string>)

    const [loadingVisible, setLoadingVisible] = useState(false)

    const [fillHeight, setFillHeight] = useState(0 as string | number)

    const containerRef = useRef(null)

    const [pagination, setPagination] = usePagination(
        1, //初始页码
        8, //初始条数
        commentTotal, //总条数
        {delay: 100, key: "details", tipsString: "没有更多评论啦"} //下滑延迟
    )

    useImperativeHandle(ref, () => {
        return {
            flushData: () => {
                getCommentListData(1, 8, true)
            }
        }
    })

    useEffect(() => {
        if (selectCommentId) {
            getCommentPageNum({
                id: selectCommentId,
                communityId: communityId,
                pageSize: pagination.pageSize
            }).then(res => {
                if (res.status === 200) {
                    setPagination({
                        ...pagination,
                        pageNum: res.data
                    })
                }
            })
        }
    }, [selectCommentId])

    useEffect(() => {
        const {pageNum, pageSize} = pagination
        getCommentListData(pageNum, pageSize, true)
    }, [pagination, condition])

    const getCommentListData = (pageNum: number, pageSize: number, reload?: boolean) => {
        const data = condition ? {
            pageNum: pageNum,
            pageSize: pageSize,
            communityId,
            [condition[0]]: condition[1]
        } : {
            pageNum: pageNum,
            pageSize: pageSize,
            communityId
        }
        setLoadingVisible(true)
        getCommentList(data).then(res => {
            if (res.status === 200) {
                reload ? setCommentList([...res.data.data]) :
                    setCommentList([...commentList, ...res.data.data])
                setCommentTotal(res.data.total)
            }
            setLoadingVisible(false)
        })
    }

    const renderCommentList = (commentList: Array<any>) => {
        return commentList?.map((item, index) => {
            return (<CommentListItem
                key={index}
                data={item}
                index={index}
                topicId={topicId}
                actionBarVisible={actionBarVisible}
                setActionBarVisible={setActionBarVisible}
                selectCommentId={selectCommentId}
                selectReplyId={selectReplyId}
            />)
        })
    }

    return (
        <React.Fragment>
            <div
                className="comment-container"
                ref={containerRef}
                style={{height: fillHeight > 0 && fillHeight}}
            >
                <div className="screening-container">
                    <Screening
                        setCondition={(array) => {
                            const offsetHeight = containerRef.current.offsetHeight
                            setFillHeight(offsetHeight)
                            setCondition([...array])
                            setTimeout(() => {
                                setFillHeight("100%")
                            }, 500)
                        }}
                        style={{margin: "0 0 3rem 0", width: "25%"}}
                        labelArray={[{
                            name: "时间",
                            key: "timeControl"
                        }]}
                    />
                </div>
                {renderCommentList(commentList)}
            </div>
            <Loading visible={loadingVisible}/>
        </React.Fragment>
    );
})

export default CommentContainer;