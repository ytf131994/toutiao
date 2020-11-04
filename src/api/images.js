import request from '@/utils/request'
export const uploadImages = (data) => {
    return request({
        url: '/v1_0/user/images',
        method: 'POST',
        data
    })
}
export const getImages = (data) => {
    return request({
        url: '/v1_0/user/images',
        method: 'GET',
        params: data
    })
}
export const saveImages = (id, collect) => {
    return request({
        url: `/v1_0/user/images/${id}`,
        method: 'PUT',
        data: {
            collect
        }
    })
}
export const removeImages = (id) => {
    return request({
        url: `/v1_0/user/images/${id}`,
        method: 'DELETE'
    })
}
