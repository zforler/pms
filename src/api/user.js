import request from '@/util/request'

// 登陆
export function login(params) {
    // params.token = getToken()
    return request({
        url: '/login',
        method: 'post',
        params
    })
}