import Vue from 'vue'
import Vuex from 'vuex';


Vue.use(Vuex)
const dic = {
    state: {
        dic: null
    },

    mutations: {
        // 设置数据字典
        SET_DIC: (state, dic) => {
            state.dic = dic
        }
    },

    actions: {
        saveDic({ commit }, dic) {
            commit('SET_DIC', dic)
        }
    },
    getters: {
        dic (state) {
            return state.dic
        }
    }
}
const dicFilter = {
    state: {
        dicFilter: {}
    },

    mutations: {
        // 设置数据字典
        SET_DIC_F: (state, dic) => {
            state.dicFilter = dic
        }
    },

    actions: {
        saveDicFilter({ commit }, dic) {
            commit('SET_DIC_F', dic)
        }
    },
    getters: {
        dicFilter (state) {
            return state.dicFilter
        }
    }
}
const rout = {
    state: {
        rout: {}
    },

    mutations: {
        // 设置数据字典
        ROUT: (state, rout) => {
            state.rout = rout
        }
    },

    actions: {
        saveRout({ commit }, rout) {
            commit('ROUT', rout)
        }
    },
    getters: {
        rout (state) {
            return state.rout
        }
    }
}

const customers = {
    state: {
        customers: []
    },

    mutations: {
        // 设置数据字典
        CUSTOMERS: (state, dic) => {
            state.customers = dic
        },
        PUSH_CUSTOMERS: (state, dic) => {
            state.customers.push(dic)
        }
    },

    actions: {
        addCustomers({ commit }, dic) {
            commit('CUSTOMERS', dic)
        },
        pushCustomers({ commit }, dic) {
            commit('PUSH_CUSTOMERS', dic)
        }
    },
    getters: {
        customers (state) {
            return state.customers
        }
    }
}
const store = new Vuex.Store({
    modules: {
        dic,
        dicFilter,
        rout,
        customers
    }
})
export default store