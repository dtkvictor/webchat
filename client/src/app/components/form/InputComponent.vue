<template>    
    <input :id="id" :type="type" :ref="id" :accept="accept" :min="minLength" :max="maxLength"/>            
</template>
<script>

export default {
    props:{
        id: { required: true },
        type: { type:String, default: 'text' },
        minLength: { type: Number },
        maxLength: { type: Number },        
        maxSize: { type: Number },
        accept: { type: String }
    },
    
    mounted() {            
        const action = this[this.type]
        if(action){            
            action(this.$refs[this.id])
        }
    }, 

    methods: {
        text(input){            
            console.log('text')
            input.addEventListener('keyup', this.validateText, false);
        },

        file(input){                        
            input.addEventListener('change', this.validateFile, false);                     
        },

        validateText(input) {                                   
            if(input.target.value && input.target.value.length >= this.maxLength) {
                input.target.value = input.target.value.substr(0,this.maxLength)                    
                this.$emit('error', 'maxLenght')
                return
            }
            if(input.target.value && input.target.value.length <= this.minLength) {
                this.$emit('error', 'minLenght')
                return
            }

            this.$emit('value', input.target.value)
        },

        validateFile(input) {            
            const file = input.target.files[0]                                             
            const supportedType = this.accept ? this.accept.split(',') : []                        

            if(this.maxSize && file.size > this.maxSize) {                
                this.$emit('error', 'maxSize')
                return
            }         
            
            if(!this.isValidType(supportedType, file.type)) {                
                this.$emit('error', 'supportedType')
                return
            }

            this.$emit('value', file)            
        },

        isValidType(type, fileType) {                        
            for(let i = 0; i <= type.length; i++) {
                if(type[i].at(-1) === '*') {
                    type[i] = type[i].split('/')[0]
                    fileType = fileType.split('/')[0]
                }                
                if(type[i] === fileType) {                     
                    return true
                }
            }                        
        }   
    }
}
</script>