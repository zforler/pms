import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addRole(params) {
    params.token = localCache.getToken()
    return request({
        url: '/role',
        method: 'post',
        params
    })
}
export function updaterole(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updaterole',
        method: 'post',
        params
    })
}
export function deleteRole(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteRole',
        method: 'post',
        params
    })
}
export function getRoleList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getRoleList',
        method: 'get',
        params
    })
}
export function getRolePageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getRolePageList',
        method: 'get',
        params
    })
}