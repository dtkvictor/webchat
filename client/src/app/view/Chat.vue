<template>
    <div class="container-fluid h-100" @touchstart="touchstart = $event" @touchend="showMobileSideBar($event)">
        <div class="row h-100">            
            <aside class="friends d-lg-block col-3 border-end p-0" id="side-bar" :class="{
                open:mobileSideBar,
                close:!mobileSideBar
            }">
                <friends-list></friends-list>
            </aside>            
            <div class="col-12 col-lg-9 chat">                
                <div class="chat-container" v-if="currentChat">                                            
                    <chat-header/>
                    <chat-body/>
                    <chat-footer/>                    
                </div>   
                <div v-else class="d-flex justify-content-center align-items-center text-light h-100">
                    <h3>Mensage</h3> 
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

            if(touchStart < touchEnd) {
                this.mobileSideBar = true
            }else if (touchStart > touchEnd) {
                this.mobileSideBar = false
            }                   
                                  
        },            
    },                      
}
</script>
