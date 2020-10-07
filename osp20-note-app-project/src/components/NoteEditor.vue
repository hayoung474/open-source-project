<template>
<div>
    <div class="note-grid">
        <div class="note-editor">
            <input class="title-input" type="text" v-model="title" placeholder="Title">
            <textarea rows="10" v-model="text" placeholder="Take a note..."></textarea>           
            <div class="note-editor-bottom">
                <button @click=createNew class="fas fas-check-circle"><i class="fas fa-check-circle"></i></button>
            </div>  
           
        </div>
    </div>
     <v-color-picker v-model="theme"></v-color-picker>
    </div>
</template>

<script>

export default {
    data: function() {
        return {
            title: '',            
            theme: '',            
            text: ''
        }
    },   
    methods: {        
        createNew() {
            this.$emit('noteAdded', this.title, this.text, this.theme);
            this.title = '';
            this.text = '',
            this.theme = '';
        },
        deleteNote(index) {
            this.$emit('noteDeleted', index);
        },
    },
}
</script>
