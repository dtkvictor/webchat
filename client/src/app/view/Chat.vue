<template>
    <div class="container-fluid h-100" @touchstart="touchstart = $event" @touchend="showMobileSideBar($event)">
        <div class="row h-100">            
            <transition name="mobile-friends">
                <aside class="friends d-lg-block col-3 border-end p-0" id="side-bar" v-show="!currentChat">        
                    <friends-list                     
                        @clickConfigButton = "openSettings = true"
                    ></friends-list>
                </aside>            
            </transition>
            <div class="col-12 col-lg-9 chat">                
                <div class="chat-container" v-if="currentChat">                                            
                    <chat-header>
                        <template v-slot:showListUsers>                                                
                            <button class="btn material-icons btn-outline-dark friendsMenu" @click="resetCurrentChat">                                
                                groups                                                                    
                            </button>                                                    
                        </template>
                    </chat-header>
                    <chat-body/>
                    <chat-footer/>                    
                </div>                   
                <div class="h-100 w-100 d-flex justify-content-center align-items-center" v-else>
                    <div class="alert bg-light">
                        Selecione um amigo para começar a conversar
                    </div>                
                </div>
            </div>                                                                    
        </div>        
        <settings :open="openSettings" @close="openSettings = false"></settings>   
        <no-users-online></no-users-online>     
    </div>    
</template>

<script>        
import FriendsList from '@/app/components/FriendsList.vue'      
import ChatHeader from '@/app/components/chat/Header.vue'         
import ChatBody from '@/app/components/chat/Body.vue'         
import ChatFooter from '@/app/components/chat/Footer.vue'         
import Settings from '@/app/components/chat/Settings.vue'         
import NoUsersOnline from '@/app/components/NoUsersOnline.vue'

import { mapMutations, mapState } from 'vuex'
    
export default {        
    components: { 
        ChatHeader, 
        ChatBody, 
        ChatFooter, 
        FriendsList, 
        Settings, 
        NoUsersOnline 
    },                          
    data:() => ({                
        openSettings: false,
        touchstart: ''       
    }),        
    computed:{
        ...mapState(['currentChat']),                
    },
    methods: {            
        ...mapMutations(['resetCurrentChat']),
        showMobileSideBar(event) {
            const touchStart = this.touchstart.changedTouches[0].clientX
            const touchEnd = event.changedTouches[0].clientX   

            if(touchStart < touchEnd) {
                this.resetCurrentChat()
            }                                                     
        },            
    },                      
}
</script>
