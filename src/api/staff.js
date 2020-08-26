import request from '@/util/request'
import localCache from '../util/localCache';

export function addStaff(params) {
    params.token = localCache.getToken()
    return request({
        url: '/staff',
        method: 'post',
        params
    })
}
export function updateStaff(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateStaff',
        method: 'post',
        params
    })
}
export function deleteStaff(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteStaff',
        method: 'post',
        params
    })
}
export function getStaffList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getStaffList',
        method: 'get',
        params
    })
}
export function getStaffPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getStaffPageList',
        method: 'get',
        params
    })
}