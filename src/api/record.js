import request from '@/util/request'
import localCache from '../util/localCache';

export function getRecordList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getRecordList',
        method: 'get',
        params
    })
}