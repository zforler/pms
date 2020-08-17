import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'
import qs from 'qs'
// download url
// const downloadUrl = url => {
//   let iframe = document.createElement('iframe')
//   iframe.style.display = 'none'
//   iframe.src = url
//   iframe.onload = function() {
//     document.body.removeChild(iframe)
//   }
//   document.body.appendChild(iframe)
// }

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API, // api的base_url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['x-token'] = getToken()
    // 以表单的形式提交数据
    let header = config.headers['Content-Type']
    if (!header) {
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
        if (config.method === 'post') {
            // { indices: false }确保数组提交成功
            config.data = qs.stringify(config.data, { indices: false })
        }
    }
    config.paramsSerializer = function(params) {
        return qs.stringify(params, { indices: false })
    }
    return config
}, error => {
    Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
    response => {
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
            // debugger

        let res = response.data
        if (response.status === 401 || res.errorcode === 2002 || res.errorcode === 2005) {
            if (res.errorcode === 2005) {
                MessageBox.confirm('用户被锁定，可以取消继续留在该页面，或者重新登录', '确定登出', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('FedLogOut').then(() => {
                        location.reload(); // 为了重新实例化vue-router对象 避免bug
                    });
                })
                return Promise.reject('error');
            }
            MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
                confirmButtonText: '重新登录',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                store.dispatch('FedLogOut').then(() => {
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
            })
            return Promise.reject('error');
        }

        // 返回 errorcode 为3000，用户没有权限
        // if (res.errorcode === 3000 && res.message === null) {
        //   Message.warning('用户无操作权限')
        //   return Promise.reject('error')
        // }

        if (response.status !== 200) {
            Message({
                message: res.message,
                type: 'error',
                duration: 5 * 1000
            });
        } else {
            if (response.headers && (response.headers['content-type'] === 'application/x-msdownload' ||
                response.headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                response.headers['content-type'] === 'application/octet-stream;charset=UTF-8')) {
                // debugger
                // downloadUrl(response.request.responseURL)

                // response.data = '';
                // response.headers['content-type'] = 'text/json'
                const content = response.data
                const blob = new Blob([content])
                console.info(content)
                console.info(blob.size)

                const fileNames = response.headers['content-disposition'].match(/filename="(.*)"/);
                const fileName = fileNames[1]
                // debugger
                if ('download' in document.createElement('a')) { // 非IE下载
                    const elink = document.createElement('a')
                    elink.download = fileName
                    elink.style.display = 'none'
                    elink.href = URL.createObjectURL(blob)
                    document.body.appendChild(elink)
                    elink.click()
                    URL.revokeObjectURL(elink.href) // 释放URL 对象
                    document.body.removeChild(elink)
                } else { // IE10+下载
                    navigator.msSaveBlob(blob, fileName)
                }
                return response;
            } else {
                return response.data;
            }
        }
    },
    error => {
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    })

export default service