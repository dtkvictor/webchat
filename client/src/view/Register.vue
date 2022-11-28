<template>
    <section id="Register" class="full-height d-flex justify-content-center align-items-center register">
        <div class="form-register p-3">            
            <div class="col-12 text-center mb-4 mt-3">
                <img class="border border-dark rounded mx-auto d-block img-size" :src="profilePicture" alt="profilePicture">                                                
            </div>                                                                    
            <div class="d-grid justify-content-center">                                            
                <div class="mb-3">
                    <label class="form-label" for="profilePicture">Escolha uma foto:</label>
                    <input type="file" class="form-control" id="profilePicture" @change="getProfilePicture($event)" accept="image/jpeg">                          
                    <Transition name="alert">
                        <small class="text-danger" role="alert" v-if="alert.invalidFormat">
                            O arquivo deve ser uma imagem do tipo JPEG
                        </small>                        
                    </Transition>                                        
                </div>   
                <div class="mb-3">
                    <label class="form-label" for="username">Nome:</label>
                    <input type="text" class="form-control" id="username" placeholder=""
                        v-model="name" @keypress="validateUsername" @keyup="validateUsername"
                    >                                        
                    <div style="height:20px">
                        <Transition name="alert">
                            <small class="text-danger" v-if="alert.maxLength">
                                O nome deve ter no máximo 50 caracteres                                                 
                            </small>                                            
                        </Transition>           
                    </div>                     
                </div>                              
                <button type="button" class="register-button-size btn btn-dark p-0" @click="save" 
                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Preencha todos os campos"
                >
                    Salvar
                </button>                     
                <Transition name="alert">
                    <small class="text-danger" v-if="alert.invalidField">
                        Por favor, preencha todos os campos.
                    </small>                                            
                </Transition>     
            </div>
        </div>        
    </section>
</template>
<script>
    export default {
        data(){
            return {            
                name:null,    
                profilePicture:'data:image/jpeg;base64,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',
                alert: {
                    maxLength:false,
                    invalidFormat:false,
                    invalidField:false,
                }
            }
        },
        methods:{
            save(){
                if(!this.name){
                    this.alert.invalidField = true
                    return false
                }
                localStorage.setItem('userData',JSON.stringify({
                    name:this.name,
                    picture:this.profilePicture,
                }))
                this.$router.push('/')
            },
            validateUsername(){
                if(this.name.length >= 50){
                    this.name = this.name.substr(0,50);
                    this.alert.maxLength = true;                    
                }else{
                    this.alert.maxLength = false
                }                                
            },
            validateFormatImage(image){                                        
                if(image.type != 'image/jpeg'){
                    this.alert.invalidFormat = true;
                    return false
                }                
                return true;
            },
            getProfilePicture(event){  
                const image = event.target.files[0]
                const file = new FileReader();
                if(this.validateFormatImage(image)){
                    file.onload = (data) => this.profilePicture = data.target.result
                    file.readAsDataURL(image)                                                                    
                }else{
                    this.profilePicture = 'data:image/jpeg;base64,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'
                }                                
            },
        }
    }
</script>