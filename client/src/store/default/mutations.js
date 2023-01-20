export default {

    setCurrentChat(state, object) {     
        if(!object) return               
        state.currentChat = object     
        state.users[object.id].unreadMessage = 0   
      },    
  
      addUser(state, user) {        
          if(!user.image) {
            user.image = require("@/assets/image/profile.jpeg") 
          }     
          user.messages = []                
          user.unreadMessage = 0              
          state.users[user.id] = user         
      },
  
      updateDataUser(state, payload) {                       
        if(state.users[payload.from] && state.users[payload.from][payload.field]) {
          state.users[payload.from][payload.field] = payload.value
        }      
      },
  
      addMessage(state, message) {                                    
  
          if(message.from === state.id && state.users[message.to]) {
            message.sending = true          
            message.value = state.helpers.removeHtmlTags(message.value)
            state.users[message.to].messages.push(message)                     
            return 
          }                                        
          else if(!state.users[message.from]) return 
          
          if(state.currentChat?.id !== message.from) {        
            const payload = state.helpers.defaultDataNotificationToats()
              payload.image = state.users[message.from].image
              payload.title = state.users[message.from].name
              payload.message = message.value            
            state.users[message.from].unreadMessage ++
            if(state.showNotification) state.iziToast.show(payload)                     
          }                                
  
          message.value = state.helpers.removeHtmlTags(message.value)
          state.users[message.from].messages.push(message) 
      },      
  
      editMessage(state, payload) {            
        const userId = payload.from !== state.id ? payload.from : payload.to
        if(!state.users[userId]) return 
  
        state.users[userId].messages.forEach(message => {
          if(message.id === payload.id) {
            message.value = state.helpers.removeHtmlTags(payload.value)
            return
          }
        })      
      },
  
      deleteMessage(state, payload) {      
        const userId = payload.from !== state.id ? payload.from : payload.to
        if(!state.users[userId]) return false
  
        if(state.users[userId] != state.currentChat?.id) {
          state.users[userId].unreadMessage --
        }
  
        state.users[userId].messages = state.users[userId].messages.filter(message => {
          if(message.id !== payload.id) return message
          if(message.format !== 'text') {
            window.URL.revokeObjectURL(message.value)
          }
        })      
  
      },
      
      removeUser(state, payload) {     
          if(state.currentChat?.id == payload.id) {
            state.currentChat = null
          }                                                
          delete state.users[payload.id]
      },    
  
      send(state, payload) {    
        console.log('send: ', JSON.stringify(payload))
        state.socket.send(JSON.stringify(payload))     
      }     
}