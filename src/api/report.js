import request from '@/util/request'
import localCache from '../util/localCache';

export function addReport(params) {
    params.token = localCache.getToken()
    return request({
        url: '/report',
        method: 'post',
        params
    })
}
export function updateReport(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateReport',
        method: 'post',
        params
    })
}
export function deleteReport(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteReport',
        method: 'post',
        params
    })
}
export function getReportList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getReportList',
        method: 'get',
        params
    })
}
export function shareReport(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/shareReport',
        method: 'post',
        params
    })
}
export function cancleShareReport(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/cancleShareReport',
        method: 'post',
        params
    })
}