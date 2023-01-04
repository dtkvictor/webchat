<template>        
    <router-view/>          
</template>
<script>      
import { mapMutations } from 'vuex'
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
      ...mapMutations({                                               
        message: 'addMessage',    
        update: 'editMessage',
        delete: 'deleteMessage',              
        unconnected: 'removeUser',               
        connected: 'addUser',          
      }),               

      registered(message) {
        message.users.forEach(user => {
          this.connected(user)
        });        
        this.$store.state.id = message.id                
        this.$router.push({name:'Chat'})              
      },      

      error(error) {          
        this.$store.state.socket.close()
        console.error(error)        
      }
    },
  }
</script>