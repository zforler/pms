import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addShift(params) {
    params.token = localCache.getToken()
    return request({
        url: '/shift',
        method: 'post',
        params
    })
}
export function updateShift(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateShift',
        method: 'post',
        params
    })
}
export function deleteShift(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteShift',
        method: 'post',
        params
    })
}
export function getShiftList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getShiftList',
        method: 'get',
        params
    })
}
export function getShiftPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getShiftPageList',
        method: 'get',
        params
    })
}
export function getHisShiftList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getHisShiftList',
        method: 'get',
        params
    })
}
