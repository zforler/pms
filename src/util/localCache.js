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
    setRole(role={}){
        this.cache.setItem('role', JSON.stringify(role))
    }
    getRole(){
        return  JSON.parse(this.cache.getItem('role'))
    }
    setMenus(menus){
        this.cache.setItem('menus', JSON.stringify(menus))
    }
    getMenus(){
        let menus = this.cache.getItem('menus')
        if(menus){
            return JSON.parse(menus)
        }
        return null
    }
    getMenusStr(){
        return this.cache.getItem('menus')
    }
    setMenusArr(menus){
        if(menus){
            this.cache.setItem('menusArr', JSON.stringify(menus))
        }else{
            this.cache.removeItem('menusArr')
        }

    }
    getMenusArr(){
        let menus = this.cache.getItem('menusArr')
        if(menus){
            return JSON.parse(menus)
        }
        return null
    }
    clearMenus(){
        this.cache.removeItem('menus')
    }
    setCurrentCustomerId(customerId){
        this.cache.setItem('CurrentCustomerId',customerId)
    }
    getCurrentCustomerId(){
       return this.cache.getItem('CurrentCustomerId')
    }
}
let localCache = new LocalCache();
export default localCache