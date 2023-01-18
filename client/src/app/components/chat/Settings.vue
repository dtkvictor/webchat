<template>
    <transition name="fade">
        <section class="absolute-background justify-content-start col-md-12" v-show="open">            
            <aside class="friends d-lg-block col-3 border-end p-0 w-mobile-100">
                <header class="row align-items-center justify-content-end m-0 card-friend">                       
                    <span class="material-icons w-auto float-right" translate="no" @click="$emit('close'); closeSettings()">
                        close
                    </span>                                                   
                </header>             
                <section class="p-4">      
                    <div class="mb-3">
                        <img class="border border-dark rounded mx-auto d-block img-size" :src="profile" alt="profilePicture">                                                
                    </div>                       
                    <div class="mb-3">
                        <label class="form-label" for="profilePicture">Escolha uma foto:</label>
                        <div class="input-group">
                            <input-component 
                                :self="true"
                                id="profilePicture"                                 
                                type="file" 
                                class="form-control"                                 
                                accept="image/*"      
                                @self="inputFile = $event"                                  
                                @value="file = $event"
                                @error="fileError = true"
                            />
                            <button class="input-group-text btn-warning material-icons" @click="updateImage">
                                edit
                            </button>                                                                                                            
                        </div>             
                        <Transition name="fade">
                            <small class="text-danger" role="alert" v-if="fileError">
                                A imagem deve ter no máximo 10mb!
                            </small>                        
                        </Transition>                                        
                    </div>    
                    <div class="input-group mb-3">
                        <input-component                             
                            id="updateName"
                            class="form-control" 
                            type="text" 
                            :value="$store.state.name"                             
                            :maxLength="50"                                                                                
                            :minLength="2"                                                                                                                
                            @value = "name = $event"
                            @blur="setDefaultName($event)"
                        />
                        <button class="input-group-text btn-warning material-icons" @click="updateName">
                            edit
                        </button>
                    </div>
                    <div class="form-check form-switch mb-3">
                        <input class="form-check-input px-4 py-2" type="checkbox" id="sendByEnter" v-model="$store.state.sendByEnter">
                        <label class="form-check-label ms-2" for="sendByEnter">Enviar com Enter</label>
                    </div>                                 
                    <div class="form-check form-switch">
                        <input class="form-check-input px-4 py-2" type="checkbox" id="showNotification" v-model="$store.state.showNotification">
                        <label class="form-check-label ms-2" for="showNotification">Exibir notificações</label>
                    </div>                 
                </section>
            </aside>                         
        </section>
    </transition>
</template>
<script>
import { mapActions } from 'vuex'
export default {        
    props: {
        open: {
            required:true,
            type:Boolean
        }
    },
    data: () => ({
        inputFile: null,
        file: null,
        urlBlob: null,
        name: null,
        fileError: false
    }),
    computed: {        
        profile(){
            if(this.file) {         
                return this.fileToUrlBlob(this.file)
            }            
            return this.$store.state.image
        }
    },    
    methods: {       
        ...mapActions(['updateDataUser']), 
        updateImage() {           
            if(!this.file) return 
            
            this.updateDataUser({
                field: 'image',
                value: this.file
            })                       

            this.$iziToast.success({
                message: "Foto de perfil atualizada com sucesso!"
            })

            this.file = null
        },        
        updateName() {
            if(!this.name) return 
            
            this.updateDataUser({
                field: 'name',
                value: this.name
            })                

            this.$iziToast.success({
                message: "Nome de usuário atualizado com sucesso!"
            })              

            this.name = null
        },        

        setDefaultName(input) {
            if(!input.target.value){
                input.target.value = this.$store.state.name
            } 
        },

        fileToUrlBlob(file) {
            if(this.urlBlob) window.URL.revokeObjectURL(this.urlBlob)
            this.urlBlob = window.URL.createObjectURL(file)
            return this.urlBlob
        },

        closeSettings() {            
            if(this.urlBlob) window.URL.revokeObjectURL(this.urlBlob)
            this.name = null                        
            this.file = null
            this.inputFile.value = null
        }    
    }
}
</script>