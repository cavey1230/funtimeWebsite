import React, {useEffect, useState} from 'react';

import "./noticeModal.less";
import {getHomeSettingList} from "@/api/v1/home";
import Modal from "@/basicComponent/Modal";
import {useHistory} from "react-router-dom";
import Pagination from "@/basicComponent/Pagination";
import useTimeChanger from "@/customHook/useTimeChanger";
import {useSelector} from "react-redux";
import {ReduxRootType} from "@/config/reducers";

interface Props {
    visible: boolean
    setVisible: (bool: boolean) => void
}

const NoticeModal: React.FC<Props> = (props) => {
    const {visible, setVisible} = props

    const [total, setTotal] = useState(0)

    const [list, setList] = useState([])

    const isMobile = useSelector((store: ReduxRootType) => {
        return store.windowResizeReducer.isMobile
    })

    const [pagination, setPagination] = useState({
        pageSize: isMobile ? 5 : 6,
        pageNum: 1
    })

    const history = useHistory()

    const timeChanger = useTimeChanger()

    useEffect(() => {
        visible && pagination && getData()
    }, [visible,pagination])

    const getData = () => {
        const {pageNum, pageSize} = pagination
        getHomeSettingList({
            pageNum,
            pageSize,
            settingType: "notice"
        }).then(res => {
            res.status === 200 && setList(res.data.data)
            res.status === 200 && setTotal(res.data.total)
        })
    }

    return (
        <Modal
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
            style={{
                minWidth: "30rem",
                height: isMobile && "55rem"
            }}
        >
            <div className="notice-list-group">
                {list?.map((item) => {
                    const {
                        id, mainImg, address,
                        mainTitle, subTitle, createTime
                    } = item
                    return <div className="notice-list-item" key={id} onClick={() => {
                        history.push(address)
                    }}>
                        <div className="main-img"><img src={mainImg} alt="mainImg"/></div>
                        <div className="content">
                            <div>{timeChanger(createTime)}</div>
                            <div>{mainTitle}</div>
                            <div>{subTitle}</div>
                        </div>
                    </div>
                })}
            </div>
            <div>
                <Pagination
                    total={total}
                    pagination={pagination}
                    setPagination={setPagination}
                    height={"5rem"}
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

export default NoticeModal;