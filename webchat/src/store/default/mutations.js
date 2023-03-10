export default {
  socketStart(state) {
    state.socket = new WebSocket(state.websocketUrl)
    if(state.onmessage) state.socket.onmessage = state.onmessage
    if(state.onerror) state.socket.onerror = state.onerror
  },

  socketSetEvent(state, {onmessage = null, onerror = null}){
    state.onmessage = onmessage;
    state.onerror = onerror
  },

  setCurrentChat(state, object) {     
    if(!object) return               
    state.currentChat = object     
    state.users[object.id].unreadMessage = 0   
  },    

  resetCurrentChat(state) {
    state.currentChat = null    
  },

  addUser(state, user) {              
      if(!user.image) {
        user.image = require("@/assets/image/profile.jpeg") 
      }           
      user.messages = []                
      user.unreadMessage = 0              
      state.users[user.id] = user         
      state.amountUsers ++
  },

  updateDataUser(state, payload) {                               
    if(state.users[payload.from] && state.users[payload.from][payload.field]) {
      state.users[payload.from][payload.field] = payload.value
    }      
  },

  addMessage(state, message) {    
      const userId = message.from == state.id ? message.to : message.from

      if(!state.users[userId]) return     
      if(state.currentChat?.id !== userId) {        
        const payload = state.helpers.defaultDataNotificationToats()
          payload.image = state.users[userId].image
          payload.title = state.users[userId].name
          payload.message = state.helpers.notificationByFormat(message.format, message.value)              

        state.users[userId].unreadMessage ++
        if(state.showNotification) state.iziToast.show(payload)                                 
      }                                

      message.value = state.helpers.renderByFormat(message.format, message.value)
      state.users[userId].messages.push(message) 
  },      

  editMessage(state, message) {                    
    const userId = message.from == state.id ? message.to : message.from
    if(!state.users[userId]) return 
    state.users[userId].messages.forEach(objectMessage => {          
      if(message.id === objectMessage.id) {
        objectMessage.value = state.helpers.removeHtmlTags(message.value)
        return
      }
    })      

  },

  deleteMessage(state, message) {              
    const userId = message.from == state.id ? message.to : message.from
    if(!state.users[userId]) return
    if(state.users[userId] != state.currentChat?.id) {
      state.users[userId].unreadMessage --
    }
    state.users[userId].messages = state.users[userId].messages.filter(
      objectMessage => objectMessage.id != message.id
    )      

  },
  
  removeUser(state, user) {           
      if(state.currentChat?.id == user.id) {
        state.currentChat = null
      }                          
      state.amountUsers --                      
      delete state.users[user.id]
  },    

  send(state, payload) {                
    state.socket.send(JSON.stringify(payload))     
  }     
}