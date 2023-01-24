<template>
    <section id="Register" class="h-100 d-flex justify-content-center align-items-center register">        
        <div class="form-register p-3">                        
            <div class="col-12 text-center mb-4 mt-3">                
                <img class="border border-dark rounded mx-auto d-block img-size" 
                :src="(profilePicture.urlBlob ?? defaultProfilePicture)" alt="profilePicture">                                                
            </div>                                                                    
            <div class="d-grid justify-content-center">                                            
                <div class="mb-3">
                    <label class="form-label" for="profilePicture">Escolha uma foto:</label>
                    <div class="input-group">                        
                        <input-component 
                            id="profilePicture" 
                            :self="true"
                            type="file" 
                            class="form-control" 
                            accept="image/*"     
                            @self="inputProfilePicture = $event"                                                       
                            @value="setProfilePicture($event)" 
                            @error="error.file = true"
                        />                                              
                        <button :class="['input-group-text material-icons ',{ 'text-danger': profilePicture.urlBlob }]" 
                            @click="resetProfilePicture"
                            :disabled="!profilePicture.urlBlob"
                        >delete</button>
                    </div>
                    <Transition name="fade">
                        <small class="text-danger" role="alert" v-if="error.file">
                            A imagem deve ter no máximo 10mb!
                        </small>                        
                    </Transition>                                        
                </div>   
                <div class="mb-4">
                    <label class="form-label" for="username">Nome:</label>
                    <input-component 
                        id="username"
                        type="text"                         
                        class="form-control" 
                        :maxLength="50" 
                        :minLength="2"
                        :alert="{ minLength: false }"
                        @error="error.text = $event === 'minLength' ? name = null : $event"
                        @value="name = $event"
                        @keypress="registerByEnter($event)"
                    />                                                                  
                </div>                                              
                <button type="button" class="register-button-size btn btn-dark p-0" @click="register" :disabled="!name">
                    Salvar
                </button>                                 
            </div>
        </div>                       
    </section>
</template>
<script>    
import { mapActions } from 'vuex'

export default {                     
    data: () => ({                
        name: null,                
        inputProfilePicture: null,
        profilePicture: {},                        
        defaultProfilePicture: require('@/assets/image/profile.jpeg'),  
        error: {}
    }),                                   
    methods: {            
        ...mapActions(['registerUser']),             
        setProfilePicture(file) {                  
            if(this.profilePicture.urlBlob) {
                window.URL.revokeObjectURL(this.profilePicture.urlBlob)
            }
            this.profilePicture.urlBlob = window.URL.createObjectURL(file)
            this.profilePicture.file = file            
        },
        registerByEnter(event) {
            if(event.key === 'Enter' && this.name) this.register() 
        },
        register() {                
            if(!this.name) return false                                   
            this.registerUser({
                name: this.name,
                file: this.profilePicture.file,                                
                objectUrl: this.profilePicture.urlBlob,                                
            })                                                                                                                                   
        },                  
        resetProfilePicture() {
            window.URL.revokeObjectURL(this.profilePicture.urlBlob)
            this.profilePicture = {}            
            this.inputProfilePicture.value = null
        }      
    }
}
</script>