import { createStore } from 'vuex'
import { state, getters, mutations, actions } from '@/store/default'

export default createStore({ 

  state: state,  

  getters: getters,

  mutations: mutations,    
  
  actions: actions,

})