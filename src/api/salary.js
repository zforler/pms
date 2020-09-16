import request from '@/util/request'
import localCache from '../util/localCache';

export function addSalaryAdjustLog(params) {
    params.token = localCache.getToken()
    return request({
        url: '/addSalaryAdjustLog',
        method: 'post',
        params
    })
}
export function getSalaryAdjustLogList(params={}) {
    params.token = localCache.getToken()
    return request({
        url: '/getSalaryAdjustLogList',
        method: 'get',
        params
    })
}

