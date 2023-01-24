<template>
    <transition name="fade">
            <div class="absolute-background" v-show="open">
                <div class="bg-light rounded col-10 col-lg-6">                 
                    <div class="w-100 d-flex justify-content-end p-1 pb-0" @click="this.$emit('close')">                        
                        <span class="material-icons pointer">close</span>                        
                    </div>
                    <slot name="body"></slot>                    
                </div>
            </div>        
        </transition>        
</template>
<script>    
    export default {
        props: {
            open:{
                required: true,
                type: Boolean
            }
        }          
    }
</script>