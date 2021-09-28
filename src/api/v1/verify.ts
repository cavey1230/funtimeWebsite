import {GoblogApiV1} from "@/config/fetchConfig";

export interface activeAccountParams {
    userId: number
    code: string
}

//激活账号
export const activeAccount = (data: activeAccountParams) => {
    return GoblogApiV1.GET("/public/user/active_users", data)
}

interface checkEmailParams {
    email: string
}

//检测邮箱是否存在
export const checkEmail = (data: checkEmailParams) => {
    return GoblogApiV1.GET("/public/user/check_email", data)
}

interface checkUsernameParams {
    username: string
}

//检测用户名是否存在
export const checkUsername = (data: checkUsernameParams) => {
    return GoblogApiV1.GET("/public/user/check_username", data)
}

interface sendVerifyEmailParams {
    email: string
}

//发送激活邮件
export const sendVerifyEmail = (data: sendVerifyEmailParams) => {
    return GoblogApiV1.GET("/public/user/send_new_verify_email", data)
}

interface resetPasswordParams {
    userId: number,
    code: string,
    password: string
}

//重置密码
export const resetPassword = (data: resetPasswordParams) => {
    return GoblogApiV1.POST("/public/user/reset_password", data)
}