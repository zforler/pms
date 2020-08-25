import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addDepartment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/department',
        method: 'post',
        params
    })
}
export function updateDepartment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateDepartment',
        method: 'post',
        params
    })
}
export function deleteDepartment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteDepartment',
        method: 'post',
        params
    })
}
export function getDepartmentList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getDepartmentList',
        method: 'get',
        params
    })
}
