import axiox from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
const request = axiox.create({
        baseURL: 'http://ttapi.research.itcast.cn/mp',
        transformResponse: [function (data) {
            try {
                return JSONbig.parse(data)
            } catch (err) {
                return data
            }
        }]
    })
    // http request 拦截器
request.interceptors.request.use(
    config => {
        const token = window.sessionStorage.getItem('token')
        if (token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
            config.headers.Authorization = 'Bearer ' + token // 请求头加上token
        }
        return config
    },
    err => {
        return Promise.reject(err)
    })
request.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response && error.response.status === 401) {
        window.localStorage.removeItem('user')
        router.push('/login')
    }
})
export default request
