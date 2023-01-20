export default {
    async registerUser({ commit, state }, data ) {
        state.name = data.name
        state.image = data.image.urlBlob || require("@/assets/image/profile.jpeg") 
        commit('send', {
            type:'connection',
            data: {
                name: data.name, 
                image: data.image.file ? await binaryToUrlBase64(data.image.file) : null
            }
          })   
      },
  
      async updateDataUser({ commit, state }, payload ) {                
        
        if(payload.field == 'image') {                
          window.URL.revokeObjectURL(state.image)
          state.image = window.URL.createObjectURL(payload.value)      
          payload.value = await binaryToUrlBase64(payload.value)
  
        } else {
          state.image = payload.value
        }            
  
        payload.from = state.id    
        commit('send', {type: 'update', data: payload })       
      },
  
      async editMessage({ commit, getters }, data) {                  
        const payload = getters.defaultPayload        
          payload.type = 'edit'      
          payload.data.id = data.id
          payload.data.value = data.value        
  
        commit('send', payload)
        commit('editMessage', payload.data)
      },
  
      async deleteMessageById({ commit, getters}, id) {
        const payload = getters.defaultPayload        
        payload.type = 'delete'      
        payload.data.id = id        
        commit('send', payload)
        commit('deleteMessage', payload.data)      
      },
  
      async sendMessageFileFormat( { commit, getters }, data) {
        const payload = getters.defaultPayload;      
        payload.data.value = await binaryToUrlBase64(data.file)
        payload.data.format = data.format  
        commit('send', payload)   
        
        payload.data.value = data.localFile
        commit('addMessage', payload.data)      
      },
      
      async sendMessage({ commit, getters }, message) {           
        const payload = getters.defaultPayload;      
        payload.data.value = message      
        commit('send', payload)             
        commit('addMessage', payload.data) 
      },    
}