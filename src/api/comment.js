import request from '@/utils/request'
// export const getComment = (params, allowComment) => {
//     return request({
//         url: '/v1_0/comments',
//         method: 'GET',
//         params,
//         data: {
//             allow_comment: allowComment
//         }
//     })
// }
export const updateCommentType = (id, allowComment) => {
    return request({
        url: '/v1_0/comments/status',
        method: 'PUT',
        params: {
            article_id: id
        },
        data: {
            allow_comment: allowComment
        }
    })
}
