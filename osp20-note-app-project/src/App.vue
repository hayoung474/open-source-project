<template>
    <div id="app">
        <v-app id="inspire">
            <app-header @search="search" @goHome="reset"></app-header>

            <v-container>
            <!-- 카테고리 목록 출력 -->
            <div class="text-center" style="margin: -10px">
                 <span><v-chip
                        class="ma-2"
                        style="background: gray"
                        @click="reset()">
                        모든 메모
                    </v-chip>
                </span>
                <span v-for="(category, index) in this.$store.state.category" :key="index">
                    <v-chip
                        class="ma-2"
                        :style="{ background: category.color }"
                        @click="showCategoryNote(category.title)">
                        {{ category.title }}
                    </v-chip>
                </span>
            </div>
            <div>
            <!-- 고정메모는 그리드로 보여주기 -->
            <div class="mt-10">
                <v-row>
                    <v-col
                    v-for="(note, index) in notes"
                    :key="`note-${index}`"
                    cols="6"
                    sm="4"
                    md="3"
                    v-show="(note.important===true)"
                    >
                    <Note
                        :note="note"
                        :index="index"
                        @click="password_dialog = note.secret"
                        @modifyNote="modifyNote(note)"
                        @deleteNote="deleteNote(note)"
                       ></Note>
                    </v-col>
                </v-row>
            </div>
           
            <!-- 일반 메모는 masonry로, 드래그 가능 하게 할 예정-->
            <!-- <div>
                <draggable v-masonry v-model="noteViewList" @start="drag=true" @end="drag=false">
                    <v-col
                    v-masonry-tile
                    v-for="(note, index) in noteViewList"
                    :key="`note-${index}`"
                    cols="6"
                    sm="4"
                    md="3"
                    v-show="(note.important===false)"
                    >
                    <Note
                        :note="note"
                        :index="index"
                        @click.native="password_dialog = note.secret"
                        @modifyNote="modifyNote(note)"
                        @deleteNote="deleteNote(note)"></Note>
                    </v-col>
                </draggable>
            </div> -->
            <draggable></draggable>
            <div >

                <v-row>
                    <v-col
                        v-for="(note, index) in noteViewList"
                        :key="`note-${index}`"
                        cols="6"
                        sm="4"
                        md="3"
                        v-show="(note.important===false)">
                        <v-hover v-slot="{ hover }">
                            <v-expand-transition>
                                <Note
                                    v-if="true"
                                    :note="note"
                                    :index="index"
                                    @click.native="password_dialog = note.secret"
                                    @modifyNote="modifyNote(note)"
                                    @deleteNote="deleteNote(note)"></Note>
                                <div v-if="hover" class="d-flex transition-fast-in-fast-out"></div>
                            </v-expand-transition>
                        </v-hover>
                    </v-col>
                </v-row>
            </div>

            </div>

            <v-btn
                class="mx-2 category-button"
                fab="fab"
                color="black"
                @click="category_dialog = true">
                <v-icon style="color:white;">
                    mdi-format-list-bulleted
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 sort-lastest-button"
                fab="fab"
                color="black"
                @click="sortLastest">
                <v-icon style="color:white;">
                    mdi-chevron-up
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 sort-oldest-button"
                fab="fab"
                color="black"
                @click="sortOldest">
                <v-icon style="color:white;">
                    mdi-chevron-down
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 add-button"
                fab="fab"
                color="black"
                @click="dialog = true;this.redraw();">
                <v-icon style="color:white;">
                    mdi-plus
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 refresh-button"
                fab="fab"
                color="black"
                @click="reset">
                <v-icon style="color:white;">
                    mdi-refresh
                </v-icon>
            </v-btn>

            <v-dialog
                v-model="dialog"
                max-width="800"
                color="white"
                persistent="persistent">
                <app-note-editor @editorClose="dialog = false" @redraw="redraw"></app-note-editor>
            </v-dialog>

            <v-dialog
                v-model="category_dialog"
                max-width="700"
                color="white"
                persistent="persistent">
                <notecategory @dialogClosed="category_dialog = false"></notecategory>
            </v-dialog>

            <v-dialog
                v-model="dialog2"
                max-width="800"
                color="white"
                persistent="persistent">
                <app-note-modify-editor
                    :modifyIndex="modifyIndex"
                    @editorClose="dialog2 = false;"
                    @redraw="redraw"
                    ></app-note-modify-editor>
            </v-dialog>

            <v-dialog v-model="password_dialog" max-width="500" color="white" persistent="persistent">
                <Password @dialogClosed="password_dialog = false"></Password>
            </v-dialog>

            </v-container>
        </v-app>
    </div>
</template>

<script>
    import NoteEditor from "./components/NoteEditor.vue";
    import NoteModifyEditor from "./components/NoteModifyEditor.vue";
    import Category from "./components/Category.vue";
    import Header from "./components/Header.vue";
    import Note from "./components/Note.vue";
    import Password from "./components/Password.vue";
    import draggable from 'vuedraggable'

    export default {
        name: "App",
        data: function () {
            return {
                dialog: false,
                dialog2: false,
                notes: [],
                noteViewList:[],
                isModify: false,
                modifyIndex: null,
                category_dialog: false,
                password_dialog: false,
                allMode:true,
                categoryTitle:"",
                searchKeyword:"",
            };
        },
        methods: {
            
            deleteNote(note) {
                if (confirm("정말로 삭제하시겠습니까?")) {
                    this.notes.splice(this.notes.indexOf(note), 1);
                }
                this.redraw();
            },
            
            modifyNote(note) {
                this.modifyIndex = this.notes.indexOf(note);
                this.dialog2 = true;

            },
            sortLastest() {
                this.noteViewList.sort(function (a, b) {
                    return a.sortDate > b.sortDate? -1: a.sortDate < b.sortDate? 1: 0;
                });
            },
            sortOldest() {
                this.noteViewList.sort(function (a, b) {
                    return a.sortDate < b.sortDate? -1: a.sortDate > b.sortDate? 1: 0;
                });
            },
            search(keyword) {
                this.noteViewList = this.notes.filter(note=>(note.text.includes(keyword)||note.title.includes(keyword)));
            },
            showCategoryNote(title) {
                this.categoryTitle=title;
                this.noteViewList = this.notes.filter(note=>note.category.title === title);
            },
            reset(){
                this.categoryTitle="";
                this.noteViewList = this.notes;
            },
            redraw(){
                if(this.categoryTitle !== ""){
                    this.noteViewList = this.notes.filter(note=>note.category.title === this.categoryTitle);
                }
                if(this.categoryTitle === ""){
                    this.noteViewList = this.notes;
                }
            }
        },
        
        mounted() {
            console.log(localStorage.getItem("category").length);
            if (localStorage.getItem("notes")) 
                this.$store.state.notes = JSON.parse(localStorage.getItem("notes"));
            if (localStorage.getItem("category")) {
                this.$store.state.category = JSON.parse(localStorage.getItem("category"));
            }
            if(!localStorage.getItem("category")){
                localStorage.setItem("category", JSON.stringify(this.$store.state.category));
                console.log(this.$store.state.category)
            }
            this.notes = this.$store.state.notes;
            this.noteViewList = this.notes;

        },
        // 값 변경시 적용
        updated() {
            this.notes = this.$store.state.notes;
        },
        watch: {
            notes: {
                handler() {
                    this.$store.state.notes= this.notes;
                    this.notes = this.$store.state.notes;
                    localStorage.setItem("notes", JSON.stringify(this.notes));
                },
                deep: true
            },
        },
        
        components: {
            appNoteEditor: NoteEditor,
            appHeader: Header,
            notecategory: Category,
            appNoteModifyEditor: NoteModifyEditor,
            Note,
            draggable,
            Password,
        }
    };
</script>

<style lang="scss">
    @import "@/styles/global.scss";
</style>