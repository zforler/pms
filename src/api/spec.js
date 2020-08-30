import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addSpec(params) {
    params.token = localCache.getToken()
    return request({
        url: '/spec',
        method: 'post',
        params
    })
}
export function updateSpec(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateSpec',
        method: 'post',
        params
    })
}
export function deleteSpec(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteSpec',
        method: 'post',
        params
    })
}
export function getSpecList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getSpecList',
        method: 'get',
        params
    })
}
