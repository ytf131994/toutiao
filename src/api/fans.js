import request from '@/utils/request'
export const getFans = (params) => {
    return request({
        url: '/v1_0/followers',
        method: 'GET',
        params
    })
}
export const getFansChart = () => {
    return request({
        url: '/v1_0/statistics/followers',
        method: 'GET'
    })
}
