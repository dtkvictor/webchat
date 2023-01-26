<template>    
    <input :id="id" :type="type" :ref="id" :accept="accept" :min="minLength" :max="maxLength"/>            
</template>
<script>
import { mapState } from 'vuex'

export default {
    props:{
        id: { required: true },
        self: { type:Boolean },
        type: { type:String, default: 'text' },
        minLength: { type: Number, default: 3 },
        maxLength: { type: Number, default: 50 },        
        maxSize: { type: Number, default: 10384909 },
        accept: { type: String },
        alert: { type: Object },  
        on: {type: String}      
    },

    data: () => ({
        defaultAlert: {
            maxSize: 'Esse arquivo ultrapassa o limite máximo suportado!',
            accept: 'Não é suportado esse tipo de arquivo!',    
            maxLength: 'Você atingiu a quantidade máxima de caracteres',
            minLength: 'A quantidade de caracteres é insuficiente'              
        },
        defaultEventType: {
            text: 'keyup',
            file: 'change'
        }
    }),
    
    mounted() {            
        const action = this[this.type]
        if(action) action(this.$refs[this.id])
        
        if(this.self) this.$emit('self', this.$refs[this.id])

        if(this.alert) {
            const alertPropsKey = Object.keys(this.alert)
            alertPropsKey.forEach(key => {
                if(this.defaultAlert[key]) {
                    this.defaultAlert[key] = this.alert[key]
                }
            });
        }        
    }, 

    computed: {
        eventType(){
            if(!this.on){
                return this.defaultEventType[this.type]
            } 
            return this.on
        }
    },
    methods: {
        ...mapState(['iziToast']),
        text(input) {               
            input.addEventListener(this.eventType, this.validateText, false);                      
        },

        file(input) {                        
            input.addEventListener(this.eventType, this.validateFile, false);                     
        },

        validateText(input) {                              

            if(input.target.value && input.target.value.length > this.maxLength) {
                input.target.value = input.target.value.substr(0, this.maxLength)  

                if(this.defaultAlert?.maxLength) {
                    this.toats(this.defaultAlert.maxLength)
                }                                   

                this.$emit('error', 'maxLength')
                return
            }

            if(input.target.value && input.target.value.length < this.minLength) {
                if(this.defaultAlert?.minLength) {
                    this.toats(this.defaultAlert.minLength)
                }                          

                this.$emit('error', 'minLength')
                return
            }

            this.$emit('value', input.target.value)
        },

        validateFile(input) {            
            const file = input.target.files[0]                                             
            const supportedType = this.accept ? this.accept.split(',') : []                        

            if(this.maxSize && file.size > this.maxSize) { 
                if(this.defaultAlert?.maxSize) {
                    this.toats(this.defaultAlert.maxSize)
                } 

                this.$emit('error', 'maxSize')
                return
            }         
            
            if(!this.isValidType(supportedType, file.type)) {                    
                if(this.defaultAlert?.accept) {
                    this.toats(this.defaultAlert.accept)
                } 
                
                this.$emit('error', 'supportedType')
                return
            }

            this.$emit('value', file)            
        },

        isValidType(type, fileType) {                        
            for(let i = 0; i < type.length; i++) {                
                if(type[i].at(-1) === '*') {
                    type[i] = type[i].split('/')[0].trim()
                    fileType = fileType.split('/')[0]
                }                
                if(type[i] === fileType) {                     
                    return true
                }                
            }                        
        },            

        toats(message) {                     
            this.iziToast().warning({                
                message: message,
            });
        }
    }    
}
</script>