import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addProduction(params) {
    params.token = localCache.getToken()
    return request({
        url: '/production',
        method: 'post',
        params
    })
}
export function updateProduction(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateProduction',
        method: 'post',
        params
    })
}
export function deleteProduction(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteProduction',
        method: 'post',
        params
    })
}
export function getProductionList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionList',
        method: 'get',
        params
    })
}
export function getProductionPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionPageList',
        method: 'get',
        params
    })
}