<template>
    <div class="d-flex justify-content-center chat-footer" @keypress="sendMessageByEnter($event)">                     
        <div class="form-floating w-100">
            <textarea class="p-3 form-control border-end-0 rounded-0 rounded-start hidden" id="floatingTextarea" ref="message">
            </textarea>                
        </div>    
        <div class="btn border bg-white d-flex align-items-center rounded-0 border-start-0 border-end-0">                
            <label for="inputFile" class="material-icons fs-1 pointer" translate="no">attach_file</label>                                
            <input-component 
                class="d-none" 
                id="inputFile" 
                type="file" 
                accept="image/*, audio/*, video/*" 
                @value="selectFile($event)"
                @error="error.file = $event"
            />                
        </div>            
        <button class="btn border bg-white d-flex align-items-center rounded-0 border-start-0 rounded-end" @click="sendText" id="btnSend">
            <span class="material-icons fs-1" translate="no">send</span>
        </button>            
        <preview :preview="preview" @close="preview.status = false">
            <template v-slot:footer>
                <button class="btn btn-outline-dark d-flex">                
                    <span class="material-icons" translate="no" @click="preview.status = false">close</span>
                </button>
                <button class="btn btn-outline-dark d-flex " @click="sendFile">                
                    <span class="material-icons" translate="no">send</span>
                </button>               
            </template>
        </preview>        
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import Preview from '@/app/components/chat/Preview.vue'

export default {
    components: {Preview},
    data: () => ({
        preview: {},
        error: {}
    }),
    methods: {        
        ...mapActions(['sendMessage', 'sendMessageFileFormat']),        
        selectFile(file) {                                                     
            this.preview.status = true
            this.preview.name = file.name                                    
            this.preview.value = file
            this.preview.url = window.URL.createObjectURL(file)
            this.preview.format = file.type.split('/')[0]                    
        },
        
        sendFile() {                                
            this.sendMessageFileFormat({                    
                format: this.preview.format, 
                file: this.preview.value,   
                localFile: this.preview.url                
            })   
            this.preview.status = false            
        },

        sendText() {                
            if(!this.$refs.message.value) return false;                
            this.sendMessage(this.$refs.message.value) 
            this.$refs.message.value = ''
        },                       

        sendMessageByEnter(event){            
            if(!this.$store.state.sendByEnter) return; 
            if(event.key === 'Enter') {
                this.sendText()
                event.preventDefault();
            }            
        }
    }
}
</script>