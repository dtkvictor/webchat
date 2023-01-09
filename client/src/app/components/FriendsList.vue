<template>
    <div class="h-100">        
        <div class="row align-items-center ps-2 m-0 card-friend pe-2">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Buscar" @keyup="search($event)">                
                <span class="input-group-text material-icons" translate="no">search</span>                                  
            </div>
        </div>
        <div v-for="friend, key in friendsList" :key="key" class="row align-items-center ps-2 m-0 card-friend "         
            @click="setCurrentChat(friend); 
            $emit('closeMobileSideBar')"            
        >                 
            <img :src="friend.image ? friend.image : profile">                                    
            <div class="col-8">
                <div class="d-flex justify-content-between">
                    <p class="p-0 m-0 text-truncate">{{friend.name}}</p>     
                    <small class="fw-light ms-1">{{friend.messages.at(-1)?.hour}}</small>
                </div>
                <div class="d-flex justify-content-between">        
                    <small class="fw-lighter text-truncate p-0 m-0 d-flex" v-html="lastMessage(friend.messages)">                                                                
                    </small>            
                    <small v-if="friend.unreadMessage > 0"
                        class="ms-1 bg-light shadow-sm rounded-circle notification">
                        {{friend.unreadMessage}}                        
                    </small>
                </div>
            </div>
        </div>                         
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { removeHtmlTags } from '@/support/helpers'

    export default {        
        data:() => ({                        
            profile: require('@/assets/image/profile.jpeg'),
            searchResult: null
        }),
        methods:{
            ...mapMutations([
                'setCurrentChat'
            ]),                                            
            lastMessage(listMessage){                
                if(!listMessage.at(-1)) return 
                
                const message = listMessage.at(-1)
                if(message.format !== 'text') {
                    return `<span class="material-icons">file_open</span> ${message.format}`
                }
                return removeHtmlTags(message.value)                    
            },
            search(event){
                const inputValue = event.target.value
                const search = new RegExp(inputValue.toLowerCase(), 'i')                                                
                const tempUsers = []                

                this.userSymbolicLink.forEach(user => {
                    if(search.test(this.users[user].name.toLowerCase())){
                        tempUsers.push(this.users[user])
                    }                    
                })
                                
                this.searchResult = tempUsers
            }
        },             
        computed: {         
            ...mapState([
                'users',
                'userSymbolicLink'                
            ]),   

            friendsList() {            
                if(!this.searchResult) return this.users      
                return this.searchResult                                          
            }
        }
    }
</script>