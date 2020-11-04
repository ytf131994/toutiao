import request from '@/utils/request'
export const getArticles = (data) => {
    return request({
        method: 'GET',
        url: '/v1_0/articles',
        params: data
            // Body 参数使用 data 设置
            // Query 参数使用 params 设置
            // Headers 参数使用 headers 设置

    })
}
export const getChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}
export const removeArticle = (id) => {
    return request({
        method: 'DELETE',
        url: `/v1_0/articles/${id}`
    })
}
export const publish = (data, draft = false) => {
    return request({
        method: 'POST',
        url: '/v1_0/articles',
        params: {
            draft // 是否存为草稿（true 为草稿）
        },
        data
    })
}
export const targetArticle = (id) => {
    return request({
        method: 'GET',
        url: `/v1_0/articles/${id}`
    })
}

export const putArticle = (id, data, draft) => {
    return request({
        method: 'PUT',
        url: `/v1_0/articles/${id}`,
        params: {
            draft
        },
        data
    })
}
