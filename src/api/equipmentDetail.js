import request from '@/util/request'
import localCache from '../util/localCache';

export function addSubEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/subEquipment',
        method: 'post',
        params
    })
}
export function updateSubEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateSubEquipment',
        method: 'post',
        params
    })
}
export function deleteSubEquipment(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteSubEquipment',
        method: 'post',
        params
    })
}
export function getSubEquipmentList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getSubEquipmentList',
        method: 'get',
        params
    })
}
export function getSubEquipmentPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getSubEquipmentPageList',
        method: 'get',
        params
    })
}
export function getSubEquipmentVoList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getSubEquipmentVoList',
        method: 'get',
        params
    })
}
export function getEquipmentByEquipmentId(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getEquipmentByEquipmentId',
        method: 'get',
        params
    })
}
