import {Http} from "@/utils/fetchApi";
import {confirm} from "@/basicComponent/Confirm";

export const address = "https://localhost:5000/api/v1"
export const websocketAddress = "wss://localhost:5000/api/v1"


export const GoblogApiV1 = new Http(address, {
    //CODE = 1000...用户模块的错误
    "200": "OK",
    "500": "FAIL",
    "1001": "用户名已存在",
    "1002": "密码错误",
    "1003": "用户不存在",
    "1004": "TOKEN不存在，请登录",
    "1005": "TOKEN过期",
    "1006": "认证过期请重新登录",
    "1007": "TOKEN格式错误",
    "1008": "暂无用户数据",
    "1009": "角色状态异常",
    "1010": "该用户被封停",
    "1011": "激活失败,验证码过期,或不存在",
    "1012": "修改密码失败,验证码过期,或不存在",
    "1013": "邮箱不存在",
    "1014": "经验不足,无法更改",
    //CODE = 2000...动态模块的错误
    "2001": "你之前看过这条动态哦",
    //CODE = 3000...个人情报模块的错误
    "3002": "暂无个人情报",
    //CODE = 8000...评论模块的错误
    "8001": "这条动态还没有评论哦",
    "10001": "超出活动时间,无法参加"
})

//拦截器错误策略集合
const InterceptFuncObject: { [key: string]: () => void } = {
    "1004": () => {
        confirm({
            title: "请登录",
            content: "请登录",
            onClickText: "去登录",
            onClick: () => {
                window.location.href = "/#/login"
            }
        })
    },
    "1006": () => {
        const havePassword = localStorage.getItem("password")
        if (!havePassword) {
            confirm({
                title: "认证过期",
                content: "请重新登录",
                onClickText: "去登录",
                onClick: () => {
                    window.location.href = "/#/login"
                }
            })
        }
    }
}

//拦截器 第一个参数接收拦截器的方法 第二个参数忽略toast提醒
GoblogApiV1.setIntercept((code: string) => {
    InterceptFuncObject[code] && InterceptFuncObject[code]()
}, [
    "1004",// token 丢失
    "1006",// token 过期
    "2001",// 文章被查看
    "9001",// 回复信息为0
    "8001",// 评论信息为0
])
