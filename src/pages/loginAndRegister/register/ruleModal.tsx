import React, {useEffect, useState} from 'react';
import Modal from "@/basicComponent/Modal";
import {mdParser} from '@/utils/mdParser';
import {getHomeSettingList} from "@/api/v1/home";

interface Props {
    visible: boolean,
    setVisible: (bool: boolean) => void
}

const RuleModal: React.FC<Props> = (props) => {
    const {visible, setVisible} = props

    const [value, setValue] = useState("")

    useEffect(() => {
        visible && getHomeSettingList({
            pageNum: 1,
            pageSize: 10,
            settingType: "register"
        }).then(res => {
            res.status === 200 && setValue(res.data.data[0].mainTitle)
        })
    }, [visible])

    return (
        <Modal
            visible={visible}
            onClose={() => {
                setVisible(false)
            }}
        >
            <div style={{overflowY:"auto",height:"100%"}}>
                <div dangerouslySetInnerHTML={{
                    __html: mdParser.render(String(value))
                }}/>
            </div>
        </Modal>
    );
};

export default RuleModal;