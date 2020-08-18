class LocalCache{
    constructor(){
        this.cache = window.localStorage
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
}
let localCache = new LocalCache();
export default localCache