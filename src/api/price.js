import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addPrice(params) {
    params.token = localCache.getToken()
    return request({
        url: '/price',
        method: 'post',
        params
    })
}
export function updatePrice(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updatePrice',
        method: 'post',
        params
    })
}
export function deletePrice(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deletePrice',
        method: 'post',
        params
    })
}
export function getPriceList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getPriceList',
        method: 'get',
        params
    })
}
export function getPricePageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getPricePageList',
        method: 'get',
        params
    })
}
export function getHisPriceList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getHisPriceList',
        method: 'get',
        params
    })
}
