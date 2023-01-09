<template>
    <modal :open="preview.status || false" @close="this.$emit('close')">
        <template v-slot:body>
            <div class="preview p-3 pt-1">
                <div v-html="renderByFormat(preview.format, preview.url)"></div>                    
                <p class="mt-1 ms-1">{{ preview?.name }}</p>                    
                <div class="d-flex justify-content-end gap-2"> 
                    <slot name="footer"></slot>
                </div>
            </div> 
        </template>
    </modal>                                                                                                               
</template>
<script>
    import { renderByFormat } from '@/support/helpers'
    import Modal from '../Modal.vue'
    export default {
        components: { Modal },
        props: {
            preview: {
                required: true,
                type: Object
            }
        },     
        methods:{
            renderByFormat,            
        }   
    }
</script>