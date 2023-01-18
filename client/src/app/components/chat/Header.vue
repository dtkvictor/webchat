<template>
    <div class="row align-items-center border-bottom chat-header">                  
        <img :src="currentChat?.image" v-if="currentChat">                        
        <div class="col-8">
            <p class="p-0 m-0">{{ currentChat?.name }}</p>                                        
        </div>                                
        <slot name="showListUsers"></slot>                    
    </div>
</template>
<script>
import { mapState } from 'vuex'
export default {    
    computed:{
        ...mapState(['currentChat'])
    }    
}
</script>