import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function login(params) {
    params.token = localCache.getToken()
    return request({
        url: '/login',
        method: 'post',
        params
    })
}

export function addUser(params) {
    params.token = localCache.getToken()
    return request({
        url: '/user',
        method: 'post',
        params
    })
}
export function updateUser(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateUser',
        method: 'post',
        params
    })
}
export function getUserPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getUserPageList',
        method: 'get',
        params
    })
}