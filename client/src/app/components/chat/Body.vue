<template>    
     <div class="row chat-body">
            <ul class="list-message" v-if="currentChat" v-scrollTo>                                            
                <li v-for="message, key in currentChat.messages"                
                    :key="key"                     
                    :class="['message-container', {'justify-content-end': message.sending}]"                    
                >                                                                       
                    <div :class="['d-flex gap-1 message-body text-wrap text-break lh-sm pointer', {from: message.sending}]"  
                        @click="setIdEdit(message)"
                        v-if="idEdit != message.id && message.format == 'text'"                                                                   
                    >
                        <div v-html="renderByFormat(message.format, message.value)"></div>
                        <div class="text-end fw-lighter m-0 p-0 message-hour">{{message.hour}}</div>
                    </div>             

                    <div class="d-flex gap-1" v-else>
                        <input type="text" class="form-control" :value="message?.value.replace(/\s/g, '')">
                        <button class="btn btn-warning rounded d-flex" >
                            <span class="material-icons" translate="no">edit</span>
                        </button>                        
                        <button class="btn btn-danger rounded d-flex">
                            <span class="material-icons" translate="no">delete</span>
                        </button>
                    </div>                                                                                                            
                </li>
            </ul>
        </div>
</template>
<script>
import { mapState } from 'vuex';
import { renderByFormat } from '@/support/helpers';

export default {
    data: () => ({
        idEdit:null
    }),
    computed: {
        ...mapState(['currentChat']),        
    },
    methods: {
        renderByFormat,           
        setIdEdit(message) {
            if(message.sending){
                this.idEdit = message.id
            } 
        } 
    },    
}
</script>