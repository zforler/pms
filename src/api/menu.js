import request from '@/util/request';
import localCache from '../util/localCache';
// 添加菜单
export function addMenu(params) {
    params.token = localCache.getToken()
    return request({
        url: '/menus',
        method: 'post',
        params
    })
}


// 获取菜单列表
export function getMenuList(params) {
    params.token = localCache.getToken()
    return request({
        url: '/menus',
        method: 'get',
        params
    })
}


// 获取获取用户菜单列表
export function findUserMenus(params) {
    params.token = localCache.getToken()
    return request({
        url: `/menus/${params.userId}`,
        method: 'get',
        params
    })
}

// 获取获取用户菜单列表
export function findUserConfigMenus(params) {
    params.token = localCache.getToken()
    return request({
        url: `/menus/config`,
        method: 'get',
        params
    })
}