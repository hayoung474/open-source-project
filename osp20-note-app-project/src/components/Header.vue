<template>
    <div class="header">     
      <img src="../assets/logo.png">
      <p>Vue.JS Sticky Notes</p>
      <v-btn class="add-btn" @click.prevent="openEditor"><i class="fas fa-plus"></i></v-btn>    
    </div>
</template>

<script>
    export default {
       methods:{
          openEditor: function(){
            this.$emit('openEditor');
          }
        }
    }
</script>