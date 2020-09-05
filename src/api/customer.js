import request from '@/util/request'
import localCache from '../util/localCache';

export function addCustomer(params) {
    params.token = localCache.getToken()
    return request({
        url: '/customer',
        method: 'post',
        params
    })
}
export function updateCustomer(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateCustomer',
        method: 'post',
        params
    })
}
export function deleteCustomer(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteCustomer',
        method: 'post',
        params
    })
}
export function getCustomerList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getCustomerList',
        method: 'get',
        params
    })
}
export function getCustomerPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getCustomerPageList',
        method: 'get',
        params
    })
}

export function getNoReportCustomerList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getNoReportCustomerList',
        method: 'get',
        params
    })
}
export function getHasReportCustomerList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getHasReportCustomerList',
        method: 'get',
        params
    })
}