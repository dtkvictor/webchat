<template>
    <div class="chat-container">                                
        <div class="row align-items-center border-bottom chat-header">                  
            <img :src="(currentChat?.image ? currentChat?.image : profile)" v-show="currentChat">                        
            <div class="col-8">
                <p class="p-0 m-0">{{currentChat?.name}}</p>                            
            </div>                        
            <slot name="showListUsers"></slot>            
        </div>

        <div class="row chat-body">
            <ul class="list-message" v-if="currentChat" v-scrollTo>                                            
                <li v-for="message, key in currentChat.message"                
                    :key="key"                     
                    :class="['message-container' ,{'justify-content-end': message.sending}]"                    
                >                                                           
                    <div class="d-flex gap-1"
                    :class="[css.balloon, {from: message.sending}]">
                        <div v-html="messageByFormat(message?.format, message?.value)"></div>
                        <div class="text-end fw-lighter m-0 p-0 message-hour">{{message?.hour}}</div>
                    </div>                        
                </li>
            </ul>
        </div>

        <div class="d-flex justify-content-center chat-footer">                    
            <div class="form-floating w-100">
                <textarea class="p-3 form-control border-end-0 rounded-0 rounded-start hidden" id="floatingTextarea" ref="message">
                </textarea>                
            </div>    
            <div :class="[css.btn, 'border-end-0 border-start-0']">                
                <label for="inputFile" class="material-icons fs-1 pointer" translate="no">attach_file</label>                                
                <input class="d-none" id="inputFile" type="file" accept="image/*, audio/*, video/*" @change="selectFile($event)">                
            </div>            
            <button :class="[css.btn, 'border-start-0 rounded-end']" @click="sendText">
                <span class="material-icons fs-1" translate="no">send</span>
            </button>            
        </div>

        <transition name="fade">
            <div class="absolute-background" v-show="preview?.localFile">
                <div class="bg-light rounded w-75">                 
                    <div class="preview p-3">
                        <div v-html="messageByFormat(preview.format, preview.localFile)"></div>                    
                        <p class="mt-1 ms-1">{{ preview.name }}</p>                    
                        <div class="d-flex justify-content-end gap-2"> 
                            <button class="btn btn-outline-dark d-flex" @click="preview = {}">                
                                <span class="material-icons" translate="no">close</span>
                            </button>
                            <button class="btn btn-outline-dark d-flex " @click="sendFile">                
                                <span class="material-icons" translate="no">send</span>
                            </button>               
                        </div>
                    </div>                                                                                                        
                </div>
            </div>        
        </transition>        
        
        <transition name="fade">
            <div class="alert alert-danger position-absolute start-50 top-50 d-flex" v-if="error">
                <span translate="no" class="material-icons me-1">error</span>{{ error }}
            </div>
        </transition>
        
    </div>    
</template> 
<script>
import { mapActions, mapState } from 'vuex'
import profile from '@/assets/image/profile.jpeg'

    export default {        
        data: () => ({
            preview: {},             
            error: null,            
            profile: profile,              
            css: {
                btn: 'btn border bg-white d-flex align-items-center rounded-0',
                balloon: 'message-body text-wrap text-break lh-sm',                
            },                                 
        }),                        
        computed: {            
            ...mapState([                
                'currentChat'
            ])                             
        },        
        methods:{                           
            ...mapActions([
                'sendMessage'
            ]),             
            selectFile(event){
                const selectedFile = event.target.files[0]    
                console.log(selectedFile.size)
                if(selectedFile.size > 15384909){
                    this.error = 'No momento o envio de arquivos é limitado a 15mb!'
                    setTimeout(() => {this.error = false}, 4000)
                    return false                         
                }
                this.preview.name = selectedFile.name                                    
                this.preview.value = selectedFile
                this.preview.localFile = window.URL.createObjectURL(selectedFile)
                this.preview.format = selectedFile.type.split('/')[0]                    
            },  
            
            sendFile(){                                
                this.sendMessage({                    
                    format: this.preview.format, 
                    value: this.preview.value,   
                    localFile: this.preview.localFile,
                    isFile: true
                })   
                this.preview = {}
            },

            sendText(){                
                if(!this.$refs.message.value || !this.currentChat) return false;                
                this.sendMessage({
                    format: 'text',
                    value: this.$refs.message.value,                    
                })          
                this.$refs.message.value = null                
            },                     

            messageByFormat(format, value){
                switch(format){
                    case 'image':     
                        return `<img src=${value}>`                        
                    case 'video':
                        return `<video controls src=${value}></video>`                    
                    case 'audio':
                        return `<audio controls src=${value}></audio`                        
                    default:
                        return value
                }
            }                           
        }
    }
</script>