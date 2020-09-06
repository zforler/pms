import request from '@/util/request'
import localCache from '../util/localCache';


export function getSysLogPageList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/getSysLogPageList',
        method: 'get',
        params
    })
}
