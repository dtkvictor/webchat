<template>
    <section class="d-flex justify-content-center align-items-center h-100">   
        <div class="alert alert-danger">
            <h1>:(</h1>
            <h2>Poxa, parece que temos um problema</h2>
            <h3 class="fw-light">Tente atualizar a pagína ou volte mais tarde.</h3>
            <div class="d-flex justify-content-end w-100">
                <button class="btn btn-danger material-icons" translate="no" @click="reconnect">
                    refresh
                </button>
            </div>
        </div>
        <div class="absolute-background" v-if="load">
            <div class="spinner-border text-light" role="status" style="scale:4;">
                <span class="visually-hidden">Carregando...</span>
            </div>
        </div>                    
    </section>    
</template>
<script>
import { mapMutations, mapState } from 'vuex'
    export default {
        data:() => ({
            load:false
        }),
        computed: {
            ...mapState(['connectionState']),            
        },
        methods:{    
            ...mapState(['iziToast']),
            ...mapMutations(['socketStart']),

            reconnect() {                            
                this.socketStart()
                this.load = true                                    
                setTimeout(()=> {                    
                    this.load = false      
                    if(this.connectionState) {
                        this.$router.push({name:'Chat'}) 
                        return        
                    }              
                    this.iziToast().warning({
                        message: "Falha ao se conectar com servidor!"
                    })                                                                 
                }, 2000)                                                
            }
        }
    }        
</script>