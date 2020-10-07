<template>
    <div id="app">
        <v-app id="inspire">
            <app-header></app-header>
            <div class="noteContainer">
                <div
                    v-for="(note, index) in notes"
                    :key="`note-${index}`"
                    class="note"
                    :style="{ 'background-color': note.theme }">
                    <div>
                        <span class="delete" @click.prevent="deleteNote(index)">
                            <i class="fas fa-times"></i >
                        </span>
                        <span>{{ note.title }}</span>
                        <p class="note-text">{{ note.text }}</p>
                    </div>
                </div>
                <v-btn
                    class="mx-2 add-button"
                    fab="fab"
                    dark="dark"
                    color="Indigo"
                    @click="dialog = true">
                    <v-icon dark="dark">
                        mdi-plus
                    </v-icon>
                </v-btn>
                
                <v-dialog v-model="dialog" max-width="800" color="white">
                    <app-note-editor @noteAdded="newNote" @noteDeleted="deleteNote"></app-note-editor>
                </v-dialog>

            </div>
        </v-app>
    </div>
</template>

<script>
    import NoteEditor from "./components/NoteEditor.vue";
    import Header from "./components/Header.vue";

    export default {
        name: "App",
        data: function () {
            return {
                dialog: false,
                editorOpen: false,
                notes: [
                    {
                        title: "Code",
                        text: "1131111222",
                        theme: "#FF8A80"
                    }, {
                        title: "event",
                        text: "event",
                        theme: "#DDA0DD"
                    }
                ]
            };
        },
        computed: {},
        methods: {
            newNote(title, text, theme, CloseEditor) {
                this.dialog = CloseEditor;
                console.log(CloseEditor);
                this
                    .notes
                    .push({title: title, text: text, theme: theme});
            },
            deleteNote(index) {
                this
                    .notes
                    .splice(index, 1);
            }
        },
        mounted() {
            if (localStorage.getItem("notes")) 
                this.notes = JSON.parse(localStorage.getItem("notes"));
            }
        ,
        watch: {
            notes: {
                handler() {
                    var newNotes = this.notes;
                    localStorage.setItem("notes", JSON.stringify(newNotes));
                },
                deep: true
            }
        },
        components: {
            appNoteEditor: NoteEditor,
            appHeader: Header
        }
    };
</script>

<style lang="scss">
    @import "@/styles/global.scss";
</style>