<template>
    <div class="header"> 
        <img src="../assets/note_logo.png">
        <p>STICKY NOTE</p>
        <!-- <v-btn class="add-btn" @click.prevent="openEditor"><i class="fas fa-plus"></i></v-btn>     -->
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
