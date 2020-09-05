import request from '@/util/request'
import localCache from '../util/localCache';
// 登陆
export function addEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/equipment',
        method: 'post',
        params
    })
}
export function updateEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateEquipment',
        method: 'post',
        params
    })
}
export function deleteEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteEquipment',
        method: 'post',
        params
    })
}
export function getEquipmentList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getEquipmentList',
        method: 'get',
        params
    })
}
export function getEquipmentPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getEquipmentPageList',
        method: 'get',
        params
    })
}
