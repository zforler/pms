import request from '@/util/request'
import localCache from '../util/localCache';
export function addBatch(params) {
    params.token = localCache.getToken()
    return request({
        url: '/batch',
        method: 'post',
        params
    })
}
export function updateBatch(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateBatch',
        method: 'post',
        params
    })
}
export function deleteBatch(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteBatch',
        method: 'post',
        params
    })
}
export function getBatchList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getBatchList',
        method: 'get',
        params
    })
}


export function addBatchItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/batchItem',
        method: 'post',
        params
    })
}
export function updateBatchItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/updateBatchItem',
        method: 'post',
        params
    })
}
export function deleteBatchItem(params) {
    params.token = localCache.getToken()
    return request({
        url: '/deleteBatchItem',
        method: 'post',
        params
    })
}

export function getBatchItemPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getBatchItemPageList',
        method: 'get',
        params
    })
}