<template>
    <div id="app">
        <v-app id="inspire">
            <app-header @search="search"></app-header>
            <div class="text-center" style="margin:-10px;">
                <span   
                    v-for="(category,index) in this.$store.state.category" :key="index">
                    <v-chip class="ma-2">{{category.title}}</v-chip>
                </span>
            </div>
            <div class="noteContainer" v-if="!searchMode">
                <div v-masonry="containerId" item-selector=".item" >
                    <v-row
                        v-masonry-tile="v - masonry - tile"
                        v-for="(note, index) in notes"
                        :key="`note-${index}`"
                        class="note px-3"
                        :style="{ 'background-color': note.theme }"
                        >
                        <v-col>
                            <v-row>
                                <v-col cols="8">
                                    <strong>{{ note.title }}</strong>
                                </v-col>
                                <v-col cols="2">
                                     <span class="modify" @click.prevent="modifyNote(index)">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </v-col>
                                <v-col cols="2"> 
                                        <span class="delete" @click.prevent="deleteNote(index)">
                                        <i class="fas fa-times"></i>
                                        </span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <p class="note-text" style="white-space:pre-line;">{{ note.text }}</p>
                                </v-col>  
                            </v-row>
                            <v-row >
                                <v-spacer></v-spacer>
                                <v-col cols="12" justify="end" >
                                    <p class="text-right" style="margin-bottom:0px !important;font-size:13px;">{{ note.date }}</p>
                                </v-col>  
                            </v-row>

                        </v-col>
                    </v-row>
                </div>
            </div>
            <div class="noteContainer" v-if="searchMode">
                <div v-masonry="containerId" item-selector=".item" >
                    <v-row
                        v-masonry-tile="v - masonry - tile"
                        v-for="(note, index) in searchNotes"
                        :key="`note-${index}`"
                        class="note px-3"
                        :style="{ 'background-color': note.theme }"
                        >
                        <v-col>
                            <v-row>
                                <v-col cols="8">
                                    <strong>{{ note.title }}</strong>
                                </v-col>
                                <v-col cols="2">
                                     <span class="modify" @click.prevent="modifySearchNote(note)">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </v-col>
                                <v-col cols="2"> 
                                        <span class="delete" @click.prevent="deleteSearchNote(note,index)">
                                        <i class="fas fa-times"></i>
                                        </span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <p class="note-text" style="white-space:pre-line;">{{ note.text }}</p>
                                </v-col>  
                            </v-row>
                            <v-row >
                                <v-spacer></v-spacer>
                                <v-col cols="12" justify="end" >
                                    <p class="text-right" style="margin-bottom:0px !important;font-size:13px;">{{ note.date }}</p>
                                </v-col>  
                            </v-row>

      <v-btn
        class="mx-2 category-button"
        fab="fab"
        dark="dark"
        color="black"
        @click="category_dialog = true"
      >
        <v-icon dark="dark"> mdi-format-list-bulleted </v-icon>
      </v-btn>

      <v-btn
        class="mx-2 sort-lastest-button"
        fab="fab"
        dark="dark"
        color="black"
        @click="sortLastest"
      >
        <v-icon dark="dark"> mdi-chevron-up </v-icon>
      </v-btn>
      <v-btn
        class="mx-2 sort-oldest-button"
        fab="fab"
        dark="dark"
        color="black"
        @click="sortOldest"
      >
        <v-icon dark="dark"> mdi-chevron-down </v-icon>
      </v-btn>

      <v-btn
        class="mx-2 add-button"
        fab="fab"
        dark="dark"
        color="black"
        @click="dialog = true"
      >
        <v-icon dark="dark"> mdi-plus </v-icon>
      </v-btn>

      <v-dialog v-model="dialog" max-width="800" color="white" persistent>
        <app-note-editor
          @noteAdded="newNote"
          @editorClose="dialog = false"
        ></app-note-editor>
      </v-dialog>

            <v-btn
                class="mx-2 refresh-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="searchReset">
                <v-icon dark="dark">
                    mdi-refresh
                </v-icon>
            </v-btn>

            <v-dialog v-model="dialog" max-width="800" color="white" persistent>
                <app-note-editor @noteAdded="newNote" @editorClose="dialog=false"></app-note-editor>
            </v-dialog>

      <v-dialog v-model="dialog2" max-width="800" color="white" persistent>
        <app-note-modify-editor
          :modifyIndex="modifyIndex"
          @editorClose="dialog2 = false"
        ></app-note-modify-editor>
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
import { VueMasonryPlugin } from "vue-masonry";
Vue.use(VueMasonryPlugin);

    export default {
        name: "App",
        data: function () {
            return {
                dialog: false, 
                dialog2:false, 
                notes: [], 
                searchNotes:[],
                isModify: false,
                modifyIndex: null,
                category_dialog:false,
                searchMode:false,

            };
        },
        computed: {},
        methods: {

            deleteNote(index) {
                if (confirm("정말로 삭제하시겠습니까?")) {
                    this.notes.splice(index, 1);
                }
            },
            deleteSearchNote(note,searchIndex){
                var index = this.notes.indexOf(note);
                if (confirm("정말로 삭제하시겠습니까?")) {
                    this.notes.splice(index, 1);
                    this.searchNotes.splice(searchIndex,1);
                }
            },
            modiftySearchNote(note){
                var index = this.notes.indexOf(note);
                this.modifyIndex = index;
                this.dialog2=true;
            },
            modifyNote(index) {
                this.modifyIndex = index;
                this.dialog2=true;

                // 수정요청 후 modifyIndex 를 null 로 다시 되돌릴 것
            },
            sortLastest(){
                this.notes.sort(function(a, b) { // 최신순 정렬
                    return a.sortDate > b.sortDate ? -1 : a.sortDate < b.sortDate ? 1 : 0;
                });
            },
            sortOldest(){
                this.notes.sort(function(a, b) { // 오래된순 정렬
                    return a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0;
                });
            },
            search(keyword){
                this.searchMode= true;
                console.log(keyword);
                // 제목과 내용에 대해서 검색
                let titleSearchResult = this.notes.filter(note => note.title.includes(keyword));
                let textSearchResult = this.notes.filter(note => note.text.includes(keyword));
                this.searchNotes = titleSearchResult.concat(textSearchResult);
                // 중복 제거
                this.searchNotes = this.searchNotes.filter( (item, idx, array) => {return array.indexOf( item ) === idx ;});
                console.log(this.searchNotes);

            },
            searchReset(){
                this.searchNotes=[];
                this.searchMode=false;
            }
        },
        mounted() {
            if (localStorage.getItem("notes")) 
                this.$store.state.notes = JSON.parse(localStorage.getItem("notes"));
            if (localStorage.getItem("category")) 
                this.$store.state.category = JSON.parse(localStorage.getItem("category"));
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