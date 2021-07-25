import {showToast} from "@/utils/lightToast";

export function Http(url, errorCodeTable = {}, token = "") {
    this.baseUrl = url ? url : "http://localhost:5000"
    this.errorCodeTable = errorCodeTable
    this.token = token
}

Http.prototype.setBaseUrl = function (urlParam) {
    this.baseUrl = urlParam
}

Http.prototype.getBaseUrl = function () {
    return this.baseUrl
}

Http.prototype.setToken = function (tokenString) {
    this.token = tokenString
}

Http.prototype.getToken = function () {
    return this.token
}

Http.prototype.getConcatUrl = function (address) {
    return `${this.baseUrl}${address}`
}

Http.prototype.mapObjectToUrl = function (object) {
    const urlString = Object.keys(object).map(item => {
        if (object[item]) {
            return `${item}=${object[item]}`
        }
    }).filter(i => i).join("&")
    return "?" + urlString
}

Http.prototype.initConfig = function (moreConfig = {}) {
    let innerHeaders
    if (moreConfig.hasOwnProperty("headers")) {
        innerHeaders = moreConfig.headers
        delete moreConfig.headers
    }
    return {
        method: "GET",
        headers: {
            "Accept": "*/*",
            "Content-Type": "application/json;charset=utf-8",
            "Authorization": this.token ? `Bearer ${this.token}` : "",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
            ...innerHeaders
        },
        // credentials: 'include',//允许客户端携带cook
        mode: 'cors',
        ...moreConfig
    }
}

Http.prototype.baseApi = function (url, moreConfig = {}) {
    const haveToken = localStorage.getItem("token")
    haveToken && (haveToken !== this.token) && this.setToken(haveToken)
    return new Promise((resolve, reject) => {
        fetch(url, this.initConfig(moreConfig)).then(async response => {
            const result = await response.json()
            result["status"] !== 200 &&
            Object.keys(this.errorCodeTable).map(item => {
                result["status"] === Number(item) &&
                showToast(this.errorCodeTable[item], "error")
            });
            resolve(result)
        }).catch(err => {
            console.warn(err)
            reject(err)
        })
    })
}

Http.prototype.GET = function (address, data) {
    const baseUrl = this.getConcatUrl(address)
    const url = data ? baseUrl + this.mapObjectToUrl(data) : baseUrl
    return this.baseApi(url)
}

Http.prototype.POST = function (address, data) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

Http.prototype.PUT = function (address, data) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
}

Http.prototype.DELETE = function (address) {
    return this.baseApi(this.getConcatUrl(address), {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
}

Http.prototype.UPLOAD = function (address, data) {
    const haveToken = localStorage.getItem("token")
    haveToken && (haveToken !== this.token) && this.setToken(haveToken)
    const config = {
        method: "POST",
        headers: {
            "Accept": "*/*",
            "Authorization": this.token ? `Bearer ${this.token}` : "",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        mode: 'cors',
        body: data
    }
    return new Promise((resolve, reject) => {
        fetch(this.getConcatUrl(address), config).then(async response => {
            const result = await response.json()
            result["status"] !== 200 &&
            Object.keys(this.errorCodeTable).map(item => {
                result["status"] === Number(item) &&
                showToast(this.errorCodeTable[item], "error")
            });
            resolve(result)
        }).catch(err => {
            console.warn(err)
            reject(err)
        })
    })
}

const devAddress = "http://localhost:5000/api/v1"
const productionAddress = "http://121.4.169.10:4699/api/v1"

export const GoblogApiV1 = new Http(devAddress, {
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
    //CODE = 2000...动态模块的错误
})