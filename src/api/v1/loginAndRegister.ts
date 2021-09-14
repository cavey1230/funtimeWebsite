import {GoblogApiV1} from "@/config/fetchConfig";

interface createUserParams {
    username: string
    password: string
    role?: number
    avatar?: string
    email: string
    whereToLearn: string
    verificationStatus: number
}

//新增用户
export const createUser = (data: createUserParams) => {
    return GoblogApiV1.POST("/public/user/add", data)
}

interface userLoginParams {
    username: string
    password: string
    isAutoLogin: number
}

//用户登录
export const userLogin = (data: userLoginParams) => {
    return GoblogApiV1.POST("/public/login", data)
}

interface editUserParams {
    avatar: string
}

//修改用户头像
export const editUser = (id: number, data: editUserParams) => {
    return GoblogApiV1.PUT(`/user/${id}`, data)
}