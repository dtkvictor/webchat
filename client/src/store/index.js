import { createStore } from 'vuex'
import moment from 'moment'
moment.locale('pt-br')

export default createStore({  
  state:() => ({
    socket: new WebSocket('ws://localhost:8888'),
    id:null,
    currentChat:null,                    
    users: new Object(),    
    userSymbolicLink: [],    
  }),  

  getters: {
    defaultPayload(state){
      return {
        type: 'message',
        data: {
          from: state.id,
          to: state.currentChat.id,          
          hour: moment().format('HH:mm'),
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
        user.message = []                
        user.unreadMessage = 0      
        state.users[user.id] = user 
        state.userSymbolicLink.push(user.id)       
    },

    addMessage(state, message) {                                      
        if(state.users[message.from] && state.currentChat?.id !== message.from) {
          state.users[message.from].message.push(message)          
          state.users[message.from].unreadMessage ++

        } else if(state.users[message.from]) {
          state.users[message.from].message.push(message)          

        } else if(state.users[message.to]) {
          message.sending = true
          state.users[message.to].message.push(message)
        }        
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
  },    
  
  actions: {    
    
    async addUser({commit}, user) {
      if(user.image) {
        const base64Response = await fetch(user.image)
        const blob = await base64Response.blob()
        user.image = window.URL.createObjectURL(blob)        
      }          
      commit('addUser', user)
    },

    async sendMessage({ commit, getters, state }, dataMessage) {     
      const send = (payload) => state.socket.send(JSON.stringify(payload))
      const defaultPayload = getters.defaultPayload      
        defaultPayload.data.value = dataMessage.value
        defaultPayload.data.format = dataMessage.format                               

      if(dataMessage?.isFile) {                
        const fileReader = new FileReader()                
        fileReader.onload = (data) => {                                                              
          defaultPayload.data.value = data.target.result                                                             
          send(defaultPayload)

          defaultPayload.data.value = dataMessage.localFile
          commit('addMessage', defaultPayload.data)
        }     
        fileReader.readAsDataURL(dataMessage.value)                                                                  
        return 
      }       

      send(defaultPayload)
      commit('addMessage', defaultPayload.data)
    },    
  }
})