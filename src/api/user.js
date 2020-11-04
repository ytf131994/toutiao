import request from '@/utils/request'
export const Login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}
export const getUserMessage = (data) => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile',
        headers: {
            Authorization: 'Bearer ' + data
        }
    })
}
