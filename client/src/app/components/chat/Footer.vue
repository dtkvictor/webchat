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

        <div class="absolute-background" v-if="preview.value">
            
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
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
            this.preview.name = selectedFile.name                                    
            this.preview.value = selectedFile
            this.preview.localFile = window.URL.createObjectURL(selectedFile)
            this.preview.format = selectedFile.type.split('/')[0]                    
        },
        
        sendFile() {                                
            this.sendMessage({                    
                format: this.preview.format, 
                value: this.preview.value,   
                localFile: this.preview.localFile,
                isFile: true
            })   
            this.preview = {}
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