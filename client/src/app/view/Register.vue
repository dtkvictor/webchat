<template>
    <section id="Register" class="h-100 d-flex justify-content-center align-items-center register">
        <div class="form-register p-3">            
            <div class="col-12 text-center mb-4 mt-3">
                <img class="border border-dark rounded mx-auto d-block img-size" :src="(profilePicture ?? defaultProfilePicture)" alt="profilePicture">                                                
            </div>                                                                    
            <div class="d-grid justify-content-center">                                            
                <div class="mb-3">
                    <label class="form-label" for="profilePicture">Escolha uma foto:</label>
                    <input type="file" class="form-control" id="profilePicture" @change="getProfilePicture($event)" accept="image/jpeg">                          
                    <Transition name="fade">
                        <small class="text-danger" role="alert" v-if="alert.invalidFormat">
                            O arquivo deve ser uma imagem do tipo JPEG
                        </small>                        
                    </Transition>                                        
                </div>   
                <div class="mb-3">
                    <label class="form-label" for="username">Nome:</label>
                    <input type="text" class="form-control" id="username" placeholder=""
                        v-model="name"                         
                        @keypress="getKey($event)" 
                        @keyup="validateUsername"                        
                    >                                        
                    <div style="height:20px">
                        <Transition name="fade">
                            <small class="text-danger" v-if="alert.maxLength">
                                O nome deve ter no máximo 50 caracteres                                                 
                            </small>                                            
                        </Transition>           
                    </div>                     
                </div>                              
                <button type="button" class="register-button-size btn btn-dark p-0" @click="register" 
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Preencha todos os campos"
                >
                    Salvar
                </button>                     
                <Transition name="fade">
                    <small class="text-danger" v-if="alert.invalidField">
                        Por favor, preencha todos os campos.
                    </small>                                            
                </Transition>     
            </div>
        </div>                       
    </section>
</template>
<script>
    import profile from '@/assets/image/profile.jpeg'
    import { mapMutations, mapState } from 'vuex'

    export default {                     
        data: () => ({  
            ...mapState(['socket']),
            name:null,              
            profilePicture:null,                
            defaultProfilePicture:profile,  
            alert: {
                maxLength:false,
                invalidFormat:false,
                invalidField:false,
            }
        }),                                   
        methods: {            
            ...mapMutations([
                'setAuth',
                'sendMessage'
            ]),
            getKey(event) {
                this.validateUsername()
                if(event.key === 'Enter') this.register()                
            },            
            register() {                
                if(!this.name){
                    this.alert.invalidField = true
                    return false
                }           
                this.$store.state.socket.send(JSON.stringify({
                    type:'connection',
                    data: {
                        name: this.name, 
                        image: this.profilePicture
                    }
                }))                                                                                                        
            },
            validateUsername() {
                if(this.name && this.name.length >= 50){
                    this.name = this.name.substr(0,50);
                    this.alert.maxLength = true;                    
                }else{
                    this.alert.maxLength = false
                }                                
            },
            validateFormatImage(image) {                                        
                if(image.type != 'image/jpeg'){
                    this.alert.invalidFormat = true;
                    return false
                }                
                return true;
            },            
            getProfilePicture(event) {  
                const image = event.target.files[0]
                const file = new FileReader();
                if(this.validateFormatImage(image)){
                    file.onload = (data) => this.profilePicture = data.target.result
                    file.readAsDataURL(image)                                                                    
                }
            },
        }
    }
</script>