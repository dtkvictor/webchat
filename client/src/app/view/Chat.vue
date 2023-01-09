<template>
    <div class="container-fluid h-100" @touchstart="touchstart = $event" @touchend="showMobileSideBar($event)">
        <div class="row h-100">            
            <aside class="friends d-lg-block col-3 border-end p-0" id="side-bar" :class="{
                open:mobileSideBar,
                close:!mobileSideBar
            }">
                <friends-list @closeMobileSideBar="mobileSideBar = false"></friends-list>
            </aside>            
            <div class="col-12 col-lg-9 chat">                
                <div class="chat-container">                                            
                    <chat-header>
                        <template v-slot:showListUsers>                                                
                            <button class="btn btn-outline-dark friendsMenu" @click="mobileSideBar = !mobileSideBar">
                                <transition name='fade'>
                                    <span class="material-icons" translate="no" v-if="!mobileSideBar">groups</span>
                                    <span class="material-icons" translate="no" v-else>close</span>
                                </transition>
                            </button>                                                    
                        </template>
                    </chat-header>
                    <chat-body v-if="currentChat"/>
                    <chat-footer v-if="currentChat"/>                    
                </div>   
            </div>                                                                    
        </div>        
    </div>    
</template>

<script>        
import FriendsList from '@/app/components/FriendsList.vue'      
import ChatHeader from '@/app/components/chat/Header.vue'         
import ChatBody from '@/app/components/chat/Body.vue'         
import ChatFooter from '@/app/components/chat/Footer.vue'         
import { mapState } from 'vuex'
    
export default {        
    components: { ChatHeader, ChatBody, ChatFooter, FriendsList },                          
    data:() => ({
        mobileSideBar:false,        
        touchstart:''       
    }),        
    computed:{
        ...mapState(['currentChat'])
    },
    methods: {            
        showMobileSideBar(event) {
            const touchStart = this.touchstart.changedTouches[0].clientX
            const touchEnd = event.changedTouches[0].clientX   

            if((touchStart * 2) < (touchEnd)) {
                this.mobileSideBar = true
            }else if (touchStart > touchEnd) {
                this.mobileSideBar = false
            }                   
                                  
        },            
    },                      
}
</script>
