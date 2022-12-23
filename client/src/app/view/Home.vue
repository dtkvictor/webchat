<template>
    <div class="container-fluid h-100">
        <div class="row h-100">            
            <aside class="friends d-lg-block col-3 border-end p-0" id="side-bar" :class="{
                open:mobileSideBar,
                close:!mobileSideBar
            }">
                <friends-list @closeMobileSideBar="mobileSideBar = false"></friends-list>
            </aside>            
            <div class="col-12 col-lg-9 chat">
                <chat>
                    <template v-slot:showListUsers>
                        <button class="friendsMenu btn btn-outline-dark shadow-sm" @click="showMobileSideBar">
                            <Transition name="fade">         
                                <span class="material-icons" translate="no" v-if="mobileSideBar">close</span>
                                <span class="material-icons" translate="no" v-else>groups</span>
                            </Transition>            
                        </button>                                    
                    </template>
                </chat>                    
            </div>                                                                    
        </div>        
    </div>    
</template>

<script>    
    import Chat from '@/app/components/Chat.vue'    
    import FriendsList from '@/app/components/FriendsList.vue'            

    export default {        
        components: { Chat, FriendsList},                    
        data:() => ({
            mobileSideBar:false,               
        }),        
        methods: {            
            showMobileSideBar() {
                this.mobileSideBar = !this.mobileSideBar
            },            
        },                      
    }
</script>