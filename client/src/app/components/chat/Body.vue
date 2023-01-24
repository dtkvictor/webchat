<template>    
     <div class="row chat-body">          
            <ul class="list-message" v-if="currentChat" v-scrollTo>                                            
                <li  class="mb-last-child-off" v-for="message, key in currentChat.messages" :key="key">                                        
                    <div :class="['message-container gap-1', {'justify-content-end': sending(message.from)}]">                      
                        <div :class="['d-flex gap-1 message-body text-wrap text-break lh-sm', {from: sending(message.from)}]" 
                            @click="setCurrentMessage(message)"                            
                        >                            
                            <div v-html="message.value"></div>                                                
                            <div class="text-end fw-lighter m-0 p-0 message-hour">                                
                                {{message.hour}}                                 
                            </div>                                     
                        </div>                                                                                       
                    </div>                    
                </li>
            </ul>                                 
            <modal :open="openModalMessage" @close="closeModalMessage()">
                <template v-slot:body>
                    <div class="d-flex justify-content-center p-4 pt-0">
                        <div class="preview w-100 p-3">                            
                            <textarea class="form-control"
                                :value="currentMessage.value" 
                                ref="inputEditMessage"                                
                                @keypress="editPressEnter($event, currentMessage)"
                                :disabled="!sending(currentMessage.from)"
                                v-if="currentMessage.format == 'text'"                                
                            >                    
                            </textarea>                                                                                  
                            
                            <div v-else                                 
                                v-html="currentMessage?.value">
                            </div>                    
                                                    
                            <div class="d-flex justify-content-end gap-1 mt-2">
                                <button class="btn btn-outline-warning material-icons" translate="no" @click="edit(currentMessage)"
                                    v-if="currentMessage.format === 'text' && sending(currentMessage.from)"
                                >
                                    edit
                                </button>         
                                <button class="btn btn-outline-danger material-icons" translate="no" 
                                    @click="deleteMessage({from: currentMessage.from, messageId: currentMessage.id}); closeModalMessage()"
                                >                                    
                                    delete
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
import Modal from '@/app/components/Modal.vue';

export default {    
    components: { Modal },
    data: () => ({
        currentMessage: {},               
    }),
    computed: {
        ...mapState(['currentChat', 'id']),     
        openModalMessage() {                        
            if(!this.currentMessage.status) return false            
            return true
        },        
    },
    methods: {         
        ...mapState(['helpers']),                 
        ...mapActions([
            'editMessage',
            'deleteMessage'
        ]),                    
        sending(from) {
            if(from !== this.id) return false
            return true
        },                       
        editPressEnter(event, message){
            if(!this.$store.state.sendByEnter) return; 
            if(event.key === 'Enter') {
                this.edit(message)
                event.preventDefault();
            }            
        },
        edit(message) {                                                
            const value = this.$refs.inputEditMessage.value
            const id = message.id

            if(!this.sending(message.from)) { 
                this.$refs.inputEditMessage.value = message.value               
                return false       
            } 

            if(value && id && this.currentMessage.status) {
                this.editMessage({
                    id: id,
                    value: value
                })     
            }          
            
            this.closeModalMessage()                  
        },                

        setCurrentMessage(message) {   
            if(this.currentMessage?.id === message.id) {
                this.currentMessage = {}
                return
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