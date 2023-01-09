<template>    
     <div class="row chat-body">            
            <ul class="list-message" v-if="currentChat" v-scrollTo>                                            
                <li  class="mb-last-child-off" v-for="message, key in currentChat.messages" :key="key">                                        
                    <div :class="['message-container', {'justify-content-end': message.sending}]" @click="openModalMessage(message)">                      
                        <div :class="['d-flex gap-1 message-body text-wrap text-break lh-sm', {from: message.sending}]">                                                                
                            <div v-html="renderByFormat(message.format, message.value)"></div>                                                                                                                                                                                                                                       
                            <div class="text-end fw-lighter m-0 p-0 message-hour">
                                {{message.hour}}                                 
                            </div>         
                        </div>                                     
                    </div>                        
                </li>
            </ul>                                 
            <modal :open="currentMessage?.status || false" @close="closeModalMessage()">
                <template v-slot:body>
                    <div class="d-flex justify-content-center p-3 pt-0">
                        <div v-if="currentMessage?.format !== 'text'" class="preview">
                            <div class="mb-1" v-html="renderByFormat(currentMessage?.format, currentMessage?.value)"></div>  
                            <div class="d-flex justify-content-end" v-if="currentMessage?.sending">
                                <button class="btn btn-outline-danger d-flex" 
                                    @click="deleteMessage(currentMessage.id); closeModalMessage()"
                                >
                                    <span class="material-icons" translate="no">delete</span>
                                </button>
                            </div>                                
                        </div>
                        <div v-else class="d-flex flex-wrap gap-1">
                            <input class="form-control" type="text" :value="currentMessage.value.trim()" ref="inputEditMessage">
                            <div class="d-flex justify-content-end gap-1 w-100">
                                <button class="btn btn-outline-warning d-flex" @click="edit(currentMessage.id)">
                                    <span class="material-icons" translate="no">edit</span>
                                </button>
                                <button class="btn btn-outline-danger d-flex" 
                                    @click="deleteMessage(currentMessage.id); closeModalMessage()"
                                >
                                    <span class="material-icons" translate="no">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
            </modal>        
        </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
import { renderByFormat, removeHtmlTags } from '@/support/helpers';
import Modal from '@/app/components/Modal.vue';

export default {    
    components: { Modal },
    data: () => ({
        currentMessage: null                   
    }),
    computed: {
        ...mapState(['currentChat']),        
    },
    methods: {        
        renderByFormat,           
        removeHtmlTags,        
        ...mapActions([
            'editMessage',
            'deleteMessage'
        ]),            

        edit(id) {                                    
            const value = this.$refs.inputEditMessage.value
            if(value && id && this.currentMessage.status) {
                this.editMessage({
                    id: id,
                    value: value
                })     
            }          
            this.closeModalMessage()                  
        },                

        openModalMessage(message) {
            if(!message?.sending && message.format === 'text') {
                return false
            }
            this.currentMessage = message
            this.currentMessage.status = true            
        },
        
        closeModalMessage() {
            this.currentMessage.status = false
        }

    },    
}
</script>