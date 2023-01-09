<template>
    <div class="d-flex justify-content-center chat-footer">                     
        <div class="form-floating w-100">
            <textarea class="p-3 form-control border-end-0 rounded-0 rounded-start hidden" id="floatingTextarea" ref="message">
            </textarea>                
        </div>    
        <div class="btn border bg-white d-flex align-items-center rounded-0 border-start-0 border-end-0">                
            <label for="inputFile" class="material-icons fs-1 pointer" translate="no">attach_file</label>                                
            <input class="d-none" id="inputFile" type="file" accept="image/*, audio/*, video/*" @change="selectFile($event)">                
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
        preview: {}
    }),
    methods: {
        ...mapActions(['addMessage']),        
        selectFile(event) {
            const selectedFile = event.target.files[0]                    
            if(selectedFile.size > 15384909){
                //this.error = 'No momento o envio de arquivos é limitado a 15mb!'
                //setTimeout(() => {this.error = false}, 4000)
                return false                         
            }
            this.preview.status = true
            this.preview.name = selectedFile.name                                    
            this.preview.value = selectedFile
            this.preview.url = window.URL.createObjectURL(selectedFile)
            this.preview.format = selectedFile.type.split('/')[0]                    
        },
        
        sendFile() {                                
            this.addMessage({                    
                format: this.preview.format, 
                value: this.preview.value,   
                localFile: this.preview.url,
                isFile: true
            })   
            this.preview.status = false            
        },

        sendText() {                
            if(!this.$refs.message.value) return false;                
            this.addMessage({
                format: 'text',
                value: this.$refs.message.value,                    
            })          
            this.$refs.message.value = null                
        },                       
    }
}
</script>