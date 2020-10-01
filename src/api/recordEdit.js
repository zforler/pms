import request from '@/util/request'
import localCache from '../util/localCache';

export function addRecordEditLog(params) {
    params.token = localCache.getToken()
    return request({
        url: '/recordEditLog',
        method: 'post',
        params
    })
}

export function getRecordEditLogList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getRecordEditLogList',
        method: 'get',
        params
    })
}
export function getRecordEditLogPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getRecordEditLogPageList',
        method: 'get',
        params
    })
}
