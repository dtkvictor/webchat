export default {

  async registerUser({ commit, state }, { name, file, objectUrl = null} ) 
  {
    state.name = name
    state.image = objectUrl || require("@/assets/image/profile.jpeg")         
    
    commit('send', {
        type:'connection',
        data: {
            name: name, 
            image: file ? await state.helpers.binaryToUrlBase64(file) : null
        }
    })   
  },

  async updateDataUser({ commit, state }, { field, value, objectUrl = null }) 
  {                                            
    const payload = {
      type: 'update',
      data: { from: state.id, field: field, value: value }
    }
    
    if(field === 'image') {
      window.URL.revokeObjectURL(state.image)
      state.image = objectUrl
      payload.data.value = await state.helpers.binaryToUrlBase64(value)

    }else {
      state.name = value
    }

    commit('send', payload)          
  },

  async sendMessage( { commit, getters, state }, { value, format = null, objectUrl = null }) 
  {         
    const payload = getters.defaultPayload;      
    payload.data.value = value

    if(format && format !== 'text') {
      payload.data.value = await state.helpers.binaryToUrlBase64(value)  
      payload.data.format = format
    }        
    
    commit('send', payload)       
    payload.data.value = objectUrl || value        
    commit('addMessage', payload.data)        
  },

  async editMessage({ commit, getters }, { id, value }) 
  {                  
    const payload = getters.defaultPayload        
      payload.type = 'edit'      
      payload.data.id = id
      payload.data.value = value            

    commit('send', payload)        
    commit('editMessage', payload.data)
  },

  async deleteMessage({ commit, getters }, messageId) 
  {
    const payload = getters.defaultPayload        
      payload.type = 'delete'      
      payload.data.id = messageId

    commit('send', payload)
    commit('deleteMessage', payload.data)      
  },    
}