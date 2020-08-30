import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addTechnology(params) {
    params.token = localCache.getToken()
    return request({
        url: '/technology',
        method: 'post',
        params
    })
}
export function updateTechnology(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateTechnology',
        method: 'post',
        params
    })
}
export function deleteTechnology(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteTechnology',
        method: 'post',
        params
    })
}
export function getTechnologyList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getTechnologyList',
        method: 'get',
        params
    })
}
