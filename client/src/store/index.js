import { createStore } from 'vuex'
import { binaryToUrlBase64 } from '@/support/helpers'
import moment from 'moment'
moment.locale('pt-br')

export default createStore({ 

  state:() => ({

    socket: new WebSocket('ws://10.42.0.1:8888'),
    id:null,
    currentChat: null,                    
    users: new Object(),    
    userSymbolicLink: [],    
        
  }),  

  getters: {    
    defaultPayload(state) {
      return {
        type: 'message',
        data: {
          id: state.users[state.currentChat.id].messages.length + 1000,
          from: state.id,
          to: state.currentChat.id,          
          hour: moment().format('HH:mm'),
          format: 'text',
        }
      }     
    }
  },

  mutations: {    

    setCurrentChat(state, object) {                    
      state.currentChat = object     
      state.users[object.id].unreadMessage = 0   
    },    

    addUser(state, user) {             
        user.messages = []                
        user.unreadMessage = 0      
        state.users[user.id] = user 
        state.userSymbolicLink.push(user.id)       
    },

    addMessage(state, message) {                             
        if(state.users[message.from] && state.currentChat?.id !== message.from) {
          state.users[message.from].messages.push(message)          
          state.users[message.from].unreadMessage ++

        } else if(state.users[message.from]) {
          state.users[message.from].messages.push(message)          

        } else if(state.users[message.to]) {
          message.sending = true
          state.users[message.to].messages.push(message)
        }        
    },      

    editMessage(state, payload) {            
      const userId = payload.from !== state.id ? payload.from : payload.to
      if(!state.users[userId]) return false

      state.users[userId].messages.forEach(message => {
        if(message.id === payload.id) {
          message.value = payload.value
          return false
        }
      })
    },

    deleteMessage(state, payload) {      
      const userId = payload.from !== state.id ? payload.from : payload.to
      if(!state.users[userId]) return false
      
      if(state.users[userId] != state.currentChat.id) {
        state.users[userId].unreadMessage --
      }

      state.users[userId].messages = state.users[userId].messages.filter(message => message.id != payload.id)     
    },
    
    removeUser(state, payload) {     
        if(state.currentChat?.id == payload.id) {
          state.currentChat = null
        }                                        
        state.userSymbolicLink = state.userSymbolicLink.filter (
          user => user !== payload.id
        )     
        delete state.users[payload.id]
    },    

    sendMessage(state, payload) {
      state.socket.send(JSON.stringify(payload))     
    }

  },    
  
  actions: {          
    
    async editMessage({ commit, getters }, dataMessage) {
      const defaultPayload = getters.defaultPayload        
        defaultPayload.type = 'edit'      
        defaultPayload.data.id = dataMessage.id
        defaultPayload.data.value = dataMessage.value        

      commit('sendMessage', defaultPayload)
      commit('editMessage', defaultPayload.data)
    },

    async deleteMessage({ commit, getters}, id) {
      const defaultPayload = getters.defaultPayload        
        defaultPayload.type = 'delete'      
        defaultPayload.data.id = id        

      commit('sendMessage', defaultPayload)
      commit('deleteMessage', defaultPayload.data)
      console.log(defaultPayload)
    },

    async addMessage({ commit, getters }, dataMessage) {           

      const defaultPayload = getters.defaultPayload              
        defaultPayload.data.value = dataMessage.value
        defaultPayload.data.format = dataMessage.format                               

      if(dataMessage?.isFile) {            
        defaultPayload.data.value = await binaryToUrlBase64(dataMessage.value)        
        commit('sendMessage', defaultPayload)     
        //localFile 
        defaultPayload.data.value = ''
        commit('addMessage', defaultPayload.data)
        return         
      }       
      
      commit('sendMessage', defaultPayload)     
      commit('addMessage', defaultPayload.data)
    },    
  }
})