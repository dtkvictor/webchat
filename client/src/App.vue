<template>        
    <router-view/>          
</template>
<script>   

import { mapMutations } from 'vuex'
  export default {            
    name: 'App',          

    created() {

      this.socketSetEvent({
        onmessage: (json) => {           
          const message = JSON.parse(json.data)                                   
          const action = this[message.type];                 
          if(action) action(message.data)                                    
        },
        onerror: (error) => {           
          this.error(error)
        }                    
      })
      
      this.socketStart()                                            
    },               

    methods: {      
      ...mapMutations({    
        
        socketStart: 'socketStart',                                                   
        socketSetEvent: 'socketSetEvent',        

        message: 'addMessage',    
        edit: 'editMessage',
        delete: 'deleteMessage',                      
        unconnected: 'removeUser',               
        connected: 'addUser',    
        update: 'updateDataUser',      
      }),                      

      registered(message) {
        message.users.forEach(user => this.connected(user))          
        this.$store.state.id = message.id                
        this.$router.push({name:'Chat'})              
      },      

      error(error) {          
        this.$store.state.socket.close()        
        this.$store.state.connectionState = false
        this.$router.push({name:'Error'})      
        console.error(error)        
      },

      success(data) {          
        console.log(data)      
        this.$store.state.connectionState = true        
      }
    },
  }
</script>