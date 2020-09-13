import request from '@/util/request'
import localCache from '../util/localCache';

export function getRecordList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getRecordList',
        method: 'get',
        params
    })
}

export function getYieldReportList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getYieldReportList',
        method: 'get',
        params
    })
}
export function getProductionReportdList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getProductionReportdList',
        method: 'get',
        params
    })
}

export function getMonthSalaryReportList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getMonthSalaryReportList',
        method: 'get',
        params
    })
}