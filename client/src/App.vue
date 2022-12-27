<template>        
    <router-view/>          
</template>
<script>      
import { mapActions, mapMutations } from 'vuex'
  export default {            
    name: 'App',       
    created() {
        this.$store.state.socket.onmessage = (json) => {          
          const message = JSON.parse(json.data)       
            console.log(message)                                    
          const action = this[message.type];                  
          if(action) action(message.data)                                    
        }                                

        this.$store.state.socket.onclose = () => {
          this.$router.push({
            name:'Error'            
          })
        }

    },               
    methods: {
      ...mapActions({
        connected: 'addUser',          
      }),

      ...mapMutations({                                               
        addMessage: 'addMessage',                  
        unconnected: 'removeUser',               
      }),               

      async message(message){
        if(message.format != 'text') {
          const base64Response = await fetch(message.value)
          const blob = await base64Response.blob()
          message.value = window.URL.createObjectURL(blob)
        }        
        this.addMessage(message)
      },         

      registered(message) {
        message.users.forEach(user => {
          this.connected(user)
        });        
        this.$store.state.id = message.id                
        this.$router.push({name:'Home'})              
      },      

      error(error) {          
        this.$store.state.socket.close()
        console.error(error)        
      }
    },
  }
</script>