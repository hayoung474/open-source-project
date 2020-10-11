<template>
    <div id="app">
        <v-app id="inspire">
            <app-header></app-header>
            <div class="noteContainer">
                <div v-masonry="containerId" item-selector=".item">
                    <div
                        v-masonry-tile="v - masonry - tile"
                        v-for="(note, index) in notes"
                        :key="`note-${index}`"
                        class="note"
                        :style="{ 'background-color': note.theme }">
                        <div>
                            <span>
                                <strong>{{ note.title }}</strong>
                            </span>
                            <span class="modify" @click.prevent="modifyNote(index)">
                                <i class="fas fa-edit"></i>
                            </span>
                            <span class="delete" @click.prevent="deleteNote(index)">
                                <i class="fas fa-times"></i>
                            </span>

                            <p class="note-text">{{ note.text }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <v-btn
                class="mx-2 category-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="category_dialog = true">
                <v-icon dark="dark">
                    mdi-format-list-bulleted
                </v-icon>
            </v-btn>

            <v-btn class="mx-2 sort-lastest-button" fab="fab" dark="dark" color="black">
                <v-icon dark="dark">
                    mdi-chevron-up
                </v-icon>
            </v-btn>
            <v-btn class="mx-2 sort-oldest-button" fab="fab" dark="dark" color="black">
                <v-icon dark="dark">
                    mdi-chevron-down
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 add-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="dialog=true">
                <v-icon dark="dark">
                    mdi-plus
                </v-icon>
            </v-btn>

            <v-dialog v-model="dialog" max-width="800" color="white" persistent>
                <app-note-editor @noteAdded="newNote" @editorClose="dialog=false"></app-note-editor>
            </v-dialog>

            <v-dialog v-model="category_dialog" max-width="700" color="white">
                <notecategory @dialogClosed="category_dialog=false"></notecategory>
            </v-dialog>

            <v-dialog v-model="dialog2" max-width="800" color="white" persistent>
              <app-note-modify-editor :modifyIndex="modifyIndex" @editorClose="dialog2=false" ></app-note-modify-editor>
            </v-dialog>

        </v-app>
    </div>
</template>

<script>
    import NoteEditor from "./components/NoteEditor.vue";
    import NoteModifyEditor from "./components/NoteModifyEditor.vue";
    import Category from "./components/Category.vue";
    import Header from "./components/Header.vue";
    import Vue from "vue";
    import {VueMasonryPlugin} from "vue-masonry";
    Vue.use(VueMasonryPlugin);

    export default {
        name: "App",
        data: function () {
            return {
                dialog: false, 
                dialog2:false, 
                notes: [], 
                isModify: false,
                modifyIndex: null,
                category_dialog:false,
            };
        },
        computed: {},
        methods: {

            deleteNote(index) {
                if (confirm("정말로 삭제하시겠습니까?")) {
                    this.notes.splice(index, 1);
                }
            },
            modifyNote(index) {
                this.modifyIndex = index;
                this.dialog2=true;

                // 수정요청 후 modifyIndex 를 null 로 다시 되돌릴 것
            },
        },
        mounted() {
            if (localStorage.getItem("notes")) 
                this.$store.state.notes = JSON.parse(localStorage.getItem("notes"));
            this.notes = this.$store.state.notes;
        },
        // 값 변경시 적용
        updated() {
            this.notes = this.$store.state.notes;
        },
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
            appHeader: Header,
            notecategory: Category,
            appNoteModifyEditor:NoteModifyEditor,
        }
    };
</script>

<style lang="scss">
    @import "@/styles/global.scss";
</style>