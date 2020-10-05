import request from '@/util/request'
import localCache from '../util/localCache';

export function getStaffCount(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getStaffCount',
        method: 'get',
        params
    })
}

export function getProductionCount(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionCount',
        method: 'get',
        params
    })
}
export function getEquipmentCount(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getEquipmentCount',
        method: 'get',
        params
    })
}

export function getProductionSummary(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionSummary',
        method: 'get',
        params
    })
}

export function getProductionSummaryEveryDay(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionSummaryEveryDay',
        method: 'get',
        params
    })
}

export function getProductionSummaryMonth(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionSummaryMonth',
        method: 'get',
        params
    })
}
