import React from 'react';
import useSessionStorage, {sessionType} from "@/customHook/useSessionStorage";
import useSkinStatus from "@/customHook/useSkinStatus";

import whiteLogo from "@/assets/img/logo-white.png";
import blackLogo from "@/assets/img/logo-black.png";

import "./footer.less";

const Footer = () => {
    const [sessionStorage] = useSessionStorage()

    const labelArray = ["describe", "friendLink", "copyright"] as Array<sessionType>

    const [describe, friendLink, copyright] = sessionStorage(...labelArray)

    const [_, skinStatus] = useSkinStatus()

    const renderItem = (arr: Array<any>) => {
        return arr?.length > 0 && arr?.map((item: any) => {
            const {address, mainTitle, subTitle, id} = item
            return <div
                className="friend-link-item"
                key={id}
                onClick={() => {
                    window.open(address)
                }}
            >
                <div>
                    {mainTitle}
                </div>
                <div>
                    {subTitle}
                </div>
            </div>
        })
    }

    return (
        <div className="footer-container publicFadeIn-500ms">
            <div className="footer">
                <div className="content">
                    <div className="friend-link-and-describe">
                        <div className="friend-link">
                            <div>友情链接</div>
                            <div>{renderItem(friendLink)}</div>
                        </div>
                        <div className="describe">
                            <div>申请说明</div>
                            <div>
                                <div>
                                    {describe && describe[0].mainTitle}
                                </div>
                                <div>
                                    {describe && describe[0].subTitle}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="logo-and-copyright">
                        <div className="logo">
                            <img src={skinStatus ? blackLogo : whiteLogo} alt="logo"/>
                        </div>
                        <div className="copyright">
                            <div>
                                {copyright && copyright[0].mainTitle}
                            </div>
                            <div>
                                {copyright && copyright[0].subTitle}
                            </div>
                        </div>
                    </div>
                    <div className="filings">备案号</div>
                </div>
            </div>
        </div>
    );
};

export default Footer;