<template>
    <modal :open="openModal" @close="close = true">
        <template v-slot:body>
            <div class="row align-items-center p-4 m-0 card-friend">                
                <h1>:(</h1>
                <h2>Poxa, parece que não tem ninguém online</h2>
                <h3 class="fw-light">Que tal chamar alguns amigos???</h3>                                
            </div>
        </template>
    </modal>
</template>
<script>
import Modal from '@/app/components/Modal.vue'
import { mapState } from 'vuex'
export default {    
    components: { Modal },  
    data: () => ({
        close: false
    }),  
    computed: {
        ...mapState(['amountUsers']),
        openModal(){
            if(this.amountUsers < 1 && !this.close){
                return true
            }
            return false
        }
    }
}
</script>