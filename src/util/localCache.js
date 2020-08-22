class LocalCache{
    constructor(){
        this.cache = window.localStorage
        this.sessionCache = window.sessionStorage
    }

    getToken(){
        let token = this.cache.getItem('x-token')
        return token
    }
    setToken(token){
        this.cache.setItem('x-token', token)
    }
    deleteToken(){
        this.cache.clear()
    }

    setUser(user={}){
        this.cache.setItem('user', JSON.stringify(user))
    }
    getUser(){
        return  JSON.parse(this.cache.getItem('user'))
    }

    setMenus(menus){
        if(menus){
            this.cache.setItem('menus', JSON.stringify(menus))
        }
    }
    getMenus(){
        let menus = this.cache.getItem('menus')
        if(menus){
            return JSON.parse(menus)
        }
        return null
    }

    clearMenus(){
        this.cache.removeItem('menus')
    }
}
let localCache = new LocalCache();
export default localCache