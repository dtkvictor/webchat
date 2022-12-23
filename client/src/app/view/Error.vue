<template>
    <section class="container h-100 p-5">   
        <div class="text-light">
            <h1>Poxa, parece que temos um problema</h1>
            <h2>Tente atualizar a pagína ou volte mais tarde.</h2>
        </div>
        <div class="alert alert-danger row" v-if="$route.params.status">
            <h1 class="align-items-center d-flex">Erro</h1>
            <h3>Code: {{$route.params.status}}</h3>
            <h3 v-if="$route.params.error">message: {{$route.params.error}}</h3>
            <div class="d-flex justify-content-end">
                <button class="btn btn-dark text-white d-flex">
                    <span class="material-icons fs-2" translate="no">update</span>
                </button>
            </div>
        </div>                
    </section>
</template>
<script>
    export default {}        
</script>