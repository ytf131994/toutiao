import request from '@/utils/request'
export const updatePhoto = data => {
    return request({
        url: '/v1_0/user/photo',
        method: 'PATCH',
        data
    })
}
export const updateUser = data => {
    return request({
        url: '/v1_0/user/profile',
        method: 'PATCH',
        data
    })
}
