<template>    
     <div class="row chat-body">
            <ul class="list-message" v-if="currentChat" v-scrollTo>                                            
                <li v-for="message, key in currentChat.messages" :key="key">
                    
                    <transition name="slide">
                        <div :class="['message-container', {'justify-content-end': message.sending}]"  
                            v-if="messageId != message.id && message.format == 'text'"                          
                        >                      
                            <div :class="['d-flex gap-1 message-body text-wrap text-break lh-sm', {from: message.sending}]"  
                                @click="setMessageId(message)"                                                                                             
                            >
                                <div v-html="renderByFormat(message.format, message.value)"></div>
                                <div class="text-end fw-lighter m-0 p-0 message-hour">{{message.hour}}</div>
                            </div>             
                        </div>

                        <div class="message-container justify-content-end gap-1" v-else>                                                          
                            <div class="w-auto">                                
                                <input type="text" class="form-control" :value="message?.value.trim()" ref="inputEditMessage">                                
                            </div>                        
                            <button class="btn btn-warning rounded d-flex" @click="edit(message?.value.trim())">
                                <span class="material-icons" translate="no">edit</span>
                            </button>                        
                            <button class="btn btn-danger rounded d-flex" 
                                @click = "deleteMessage(messageId); messageId = null"
                            >
                                <span class="material-icons" translate="no">delete</span>
                            </button>
                        </div>                                                                                                                   
                    </transition>

                </li>
            </ul>
        </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { renderByFormat } from '@/support/helpers';

export default {
    data: () => ({
        messageId:null,        
    }),
    computed: {
        ...mapState(['currentChat']),        
    },
    methods: {
        ...mapActions(['editMessage', 'deleteMessage']),
        renderByFormat,           
        setMessageId(message) {
            if(message.sending) {
                this.messageId = message.id
            } 
        },        
        edit(currentValue) {                        
            const value = this.$refs.inputEditMessage[0].value        
            if(this.messageId && value && currentValue != value) {
                this.editMessage({
                    id: this.messageId,
                    value: value
                })     
            }            
            this.messageId = null
        },        
    },    
}
</script>