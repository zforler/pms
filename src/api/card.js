import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addCard(params) {
    params.token = localCache.getToken()
    return request({
        url: '/card',
        method: 'post',
        params
    })
}
export function updateCard(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateCard',
        method: 'post',
        params
    })
}
export function deleteCard(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteCard',
        method: 'post',
        params
    })
}
export function getCardList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getCardList',
        method: 'get',
        params
    })
}
export function getCardPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getCardPageList',
        method: 'get',
        params
    })
}
export function getUnbindCardStaffList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getUnbindCardStaffList',
        method: 'get',
        params
    })
}
export function updateCardStatus(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateCardStatus',
        method: 'post',
        params
    })
}