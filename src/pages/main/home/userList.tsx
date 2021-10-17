import React from 'react';
import PublicAvatar from "@/pages/main/publicComponent/publicAvatar";

import "./userList.less";

interface Props {
    userList: Array<{
        avatar: string
        nickname: string
        id: number
        recommend: string
    }>
}

const UserList: React.FC<Props> = (props) => {
    const {userList} = props

    const renderList = (arr: typeof userList) => {
        return arr?.map(item => {
            const {avatar, nickname, id, recommend} = item
            return <div
                key={id}
                className="user-list-item"
            >
                <PublicAvatar
                    flexMod={"row"}
                    avatarAddress={avatar}
                    labelString={nickname}
                    justifyContent={"flex-start"}
                    alignItem={"center"}
                    mobileImgStyle={{width: "3rem"}}
                    pcImgStyle={{width: "5rem"}}
                    mobileLabelStyle={{fontSize: "1.4rem", fontWeight: "400", marginLeft: "0.5rem"}}
                    pcLabelStyle={{fontSize: "1.4rem", fontWeight: "600", marginLeft: "1rem"}}
                    expandModel={false}
                    targetUserId={id}
                />
            </div>
        })
    }

    return (
        <div className="user-list-container">
            {renderList(userList)}
        </div>
    );
};

export default UserList;