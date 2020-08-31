import request from '@/util/request'
import localCache from '../util/localCache';

export function addSysDic(params) {
    params.token = localCache.getToken()
    return request({
        url: '/sysDic',
        method: 'post',
        params
    })
}
export function updateSysDic(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateSysDic',
        method: 'post',
        params
    })
}
export function deleteSysDic(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteSysDic',
        method: 'post',
        params
    })
}
export function  getSysDicList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getSysDicList',
        method: 'get',
        params
    })
}
export function addSysDicItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/sysDicItem',
        method: 'post',
        params
    })
}
export function updateSysDicItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateSysDicItem',
        method: 'post',
        params
    })
}
export function deleteSysDicItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteSysDicItem',
        method: 'post',
        params
    })
}