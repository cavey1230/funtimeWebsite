import React, {useCallback, useMemo} from 'react';

import Modal from "@/basicComponent/Modal";
import {Props as MoreDownProps} from "@/pages/main/publicComponent/moreDropdown";
import {productionUrl} from "@/config/productionUrl";
import {QQIcon, WeChatIcon, WeiboIcon} from "@/assets/icon/iconComponent";

import "./shareModal.less";

interface Props {
    visible: boolean
    setVisible: () => void
    contentType: "comment" | "community" | "reply" | "userinfo" | "introduction"
    data: MoreDownProps["data"]
    keepHideScrollY?: boolean
}

const BannedModal: React.FC<Props> = (props) => {
    const {visible, setVisible, contentType, data,keepHideScrollY} = props

    const openWindow = (targetUrl: string, title: string, size: {
        height: number,
        width: number
    }) => {
        const {height, width} = size
        const y = (window.screen.availHeight - height);
        const x = (window.screen.availWidth - width);
        const myWindow = window.open(targetUrl, title, `height=${height}, width=${width}`);
        myWindow.moveTo(x / 2, y / 2);
    }

    const shareModel = useMemo(() => ({
        qq: (title: string, url: string, pic: string) => {
            const param = {
                url: url,
                desc: '针不错', /*分享理由*/
                title: title || '', /*分享标题(可选)*/
                summary: '',/*分享描述(可选)*/
                pics: pic || '',/*分享图片(可选)*/
                flash: '', /*视频地址(可选)*/
                site: '[FunTime-FF14业余玩家社区]' /*分享来源 (可选) */
            };
            type iType = keyof typeof param
            const s = [];
            for (let i in param) {
                s.push(i + '=' + encodeURIComponent(param[i as iType] || ''));
            }
            const targetUrl = "http://connect.qq.com/widget/shareqq/iframe_index.html?" + s.join('&');
            openWindow(targetUrl, "分享至qq", {height: 520, width: 720})
        },

        wechat: (url: string) => {
            const encodePath = encodeURIComponent(url),
                targetUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=' + encodePath;
            openWindow(targetUrl, "分享至微信", {height: 320, width: 320})
        },

        sinaWeiBo: (title: string, url: string, pic: string) => {
            const param = {
                url: url || window.location.href,
                type: '3',
                count: '1', /* 是否显示分享数，1显示(可选)*/
                appkey: '', /* 您申请的应用appkey,显示分享来源(可选)*/
                title: title, /* 分享的文字内容(可选，默认为所在页面的title)*/
                pic: pic || '', /*分享图片的路径(可选)*/
                ralateUid: '', /*关联用户的UID，分享微博会@该用户(可选)*/
                rnd: new Date().valueOf()
            }
            type iType = keyof typeof param
            const temp = [];
            for (let p in param) {
                temp.push(p + '=' + encodeURIComponent(param[p as iType] || ''))
            }
            const targetUrl = 'http://service.weibo.com/share/share.php?' + temp.join('&');
            openWindow(targetUrl, "分享至微博", {height: 430, width: 400})
        }
    }), [])

    const getTitleAndUrl = useCallback((type: typeof contentType) => {
        const {
            id, content, nickname,
            avatar, userId, imgArray,
            communityId, commentId
        } = data
        const sliceContent = `${content.slice(0, 20)}...`
        const label = `[FunTime-FF14业余玩家社区]`
        const label2 = `[FunTime-FF14在线资料卡]`
        const img = imgArray.length > 0 ? imgArray[0] : null
        type DealObject = { [key: string]: () => ({ url: string, title?: string, pic?: string }) }
        const dealObject: DealObject = {
            comment: () => ({
                url: `${productionUrl}/main/details/${communityId}/${id}/0`,
                title: `${sliceContent}${label}`
            }),
            community: () => ({
                url: `${productionUrl}/main/details/${id}`,
                title: `${sliceContent}${label}`
            }),
            reply: () => ({
                url: `${productionUrl}/main/details/${communityId}/${commentId}/${id}`,
                title: `${sliceContent}${label}`
            }),
            introduction: () => ({
                url: `${productionUrl}/main/introduction/details/${userId}"`,
                title: `${sliceContent}[${nickname}的FF14资料卡]${label2}`
            }),
        }
        type DealObjType = keyof typeof dealObject
        const innerObject = dealObject[type as DealObjType]()
        innerObject.pic = img
        return innerObject
    }, [data])

    const openShareWindow = useCallback((infoType: Props["contentType"], pipeline: keyof typeof shareModel) => {
        const innerObj = getTitleAndUrl(infoType)
        const {url, title, pic} = innerObj
        if (pipeline === "wechat") {
            shareModel[pipeline](url)
        } else {
            shareModel[pipeline](title, url, pic)
        }
    }, [data])

    return (
        <Modal
            style={{
                minWidth: "20rem",
                maxWidth: "30rem",
                height: "initial"
            }}
            visible={visible}
            onClose={() => setVisible()}
            keepHideScrollY={keepHideScrollY}
        >
            <div className="share-modal-out-container">
                <div onClick={() => {
                    openShareWindow(contentType, "qq")
                }}>
                    <QQIcon/>
                    <span>分享至QQ</span>
                </div>
                <div onClick={() => {
                    openShareWindow(contentType, "wechat")
                }}>
                    <WeChatIcon/>
                    <span>分享至微信</span>
                </div>
                <div onClick={() => {
                    openShareWindow(contentType, "sinaWeiBo")
                }}>
                    <WeiboIcon/>
                    <span>分享至微博</span>
                </div>
            </div>
        </Modal>
    )
}

export default BannedModal;