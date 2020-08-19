import request from '@/util/request';
import localCache from '../util/localCache';
// 登陆
export function addMenu(params) {
    params.token = localCache.getToken()
    return request({
        url: '/menus',
        method: 'post',
        params
    })
}