<template>
    <div id="app">
        <v-app id="inspire">
            <app-header @search="search"></app-header>

            <!-- 카테고리 목록 출력 -->
            <div class="text-center" style="margin: -10px">
                 <span><v-chip
                        class="ma-2"
                        style="background: gray"
                        @click="showCategoryNote('')">
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
            <v-container>
            <!-- 고정메모는 그리드로 보여주기 -->
            <div v-if="!searchMode">
                <v-row>
                    <v-col
                    v-for="(note, index) in notes"
                    :key="`note-${index}`"
                    cols="12"
                    md="3"
                    lg="2">
                    <Note
                        :note="note"
                        :index="index"
                        v-if="(note.important==true && ((categoryTitle==='')||(note.category.title === categoryTitle)))"
                        @click="password_dialog = note.secret"
                        @modifyNote="modifyNote(index)"
                        @deleteNote="deleteNote(index)"></Note>
                    </v-col>
                </v-row>
            </div>
            <!-- <v-container v-if="!searchMode">
                    <v-row v-masonry> 
                        <v-col v-masonry-tile v-for="(note, index) in notes" :key="`note-${index}`" cols="3">
                     <Note 
                                :note="note"
                                :index="index"
                                v-if="note.important==true"
                                @click="password_dialog = note.secret"
                                @modifyNote="modifyNote(index)"
                                @deleteNote="deleteNote(index)"></Note>
                        </v-col>
                    </v-row>
            </v-container> -->
            <!-- 일반 메모는 masonry로, 드래그 가능 -->
            <div v-if="allMode">
                <draggable v-masonry v-model="notes"
                    group="people"
                    @start="drag=true"
                    @end="drag=false"> 
                     <v-col v-masonry-tile v-for="(note, index) in notes" :key="`note-${index}`" cols="12" md="3" lg="2">
                        <Note 
                                :note="note"
                                :index="index"
                                v-if="note.important===false"
                                @click="password_dialog = note.secret"
                                @modifyNote="modifyNote(note,index)"
                                @deleteNote="deleteNote(note,index)"></Note>
                        </v-col>
                </draggable>
            </div>

            <!-- 카테고리 모드는 드래그 불가능-->
            <div v-if="categoryMode" >
                <v-row v-masonry> 
                     <v-col v-masonry-tile v-for="(note, index) in categoryNotes" :key="`note-${index}`" cols="12" md="3" lg="2">
                        <Note 
                                :note="note"
                                :index="index"
                                v-if="note.important===false"
                                @click="password_dialog = note.secret"
                                @modifyNote="modifyNote(note)"
                                @deleteNote="deleteNote(note,index)"></Note>
                        </v-col>
                </v-row>
            </div>

            <div v-if="searchMode" >
                <v-row v-masonry> 
                     <v-col v-masonry-tile v-for="(note, index) in searchNotes" :key="`note-${index}`" cols="12" md="3" lg="2">
                        <Note 
                                :note="note"
                                :index="index"
                                v-if="note.important===false"
                                @click="password_dialog = note.secret"
                                @modifyNote="modifyNote(note)"
                                @deleteNote="deleteNote(note,index)"></Note>
                        </v-col>
                </v-row>
            </div>



            <!-- <div class="noteContainer" v-if="searchMode">
                <div v-masonry="containerId" item-selector=".item">
                    <v-row
                        v-masonry-tile="v - masonry - tile"
                        v-for="(note, index) in searchNotes"
                        :key="`note-${index}`"
                        class="note px-3"
                        :style="{ 'background-color': note.theme }">
                        <v-col>
                            <v-row>
                                <v-col cols="8">
                                    <strong>{{ note.title }}</strong>
                                </v-col>
                                <v-col cols="2" v-if="note.important && !note.secret">
                                    <span class="importantonly">
                                        <i class="fas fa-star"></i>
                                    </span>
                                </v-col>
                                <v-col cols="2" v-if="note.secret && !note.important">
                                    <span class="secretonly">
                                        <i class="fas fa-lock"></i>
                                    </span>
                                </v-col>
                                <v-col cols="2" v-if="note.secret && note.important">
                                    <span class="importantsecret">
                                        <span style="color: yellow">
                                            <i class="fas fa-star"></i>
                                        </span>
                                        <span style="padding-left: 10px">
                                            <i class="fas fa-lock"></i>
                                        </span>
                                    </span>
                                </v-col>
                                <v-col cols="2">
                                    <span class="modify" @click.prevent="modifySearchNote(note)">
                                        <i class="fas fa-edit"></i>
                                    </span>
                                </v-col>
                                <v-col cols="2">
                                    <span class="delete" @click.prevent="deleteSearchNote(note, index)">
                                        <i class="fas fa-times"></i>
                                    </span>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col cols="12">
                                    <p class="note-text" style="white-space: pre-line">
                                        {{ note.text }}
                                    </p>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-spacer></v-spacer>
                                <v-col cols="12" justify="end">
                                    <p class="text-right" style="margin-bottom: 0px !important; font-size: 13px">
                                        {{ note.date }}
                                    </p>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </div> -->

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

            <v-btn
                class="mx-2 sort-lastest-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="sortLastest">
                <v-icon dark="dark">
                    mdi-chevron-up
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 sort-oldest-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="sortOldest">
                <v-icon dark="dark">
                    mdi-chevron-down
                </v-icon>
            </v-btn>

            <v-btn
                class="mx-2 add-button"
                fab="fab"
                dark="dark"
                color="black"
                @click="dialog = true">
                <v-icon dark="dark">
                    mdi-plus
                </v-icon>
            </v-btn>

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

            <v-dialog
                v-model="dialog"
                max-width="800"
                color="white"
                persistent="persistent">
                <app-note-editor @noteAdded="newNote" @editorClose="dialog = false"></app-note-editor>
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
                    @editorClose="dialog2 = false"></app-note-modify-editor>
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
                searchNotes: [],
                categoryNotes:[],
                isModify: false,
                modifyIndex: null,
                category_dialog: false,
                password_dialog: false,
                searchMode: false,
                categoryMode:false,
                allMode:true,
                categoryTitle:""
            };
        },
        methods: {
            
            deleteNote(note,index) {
                if (confirm("정말로 삭제하시겠습니까?")) {
                    if(this.allMode){
                        this.notes.splice(index, 1);
                    }
                    else if(this.categoryMode){
                        var categoryIndex = this.notes.indexOf(note);
                        this.notes.splice(categoryIndex, 1);
                        this.categoryNotes.splice(index, 1);
                
                    }
                    else if(this.searchMode){
                        var searchIndex = this.notes.indexOf(note);
                        this.notes.splice(searchIndex, 1);
                        this.searchNotes.splice(index, 1);
                    }
                }
            },
            
            modifyNote(note) {
                var index = this.notes.indexOf(note);
                console.log(index);
                this.modifyIndex = index;
                this.dialog2 = true;

                // 수정요청 후 modifyIndex 를 null 로 다시 되돌릴 것
            },
            sortLastest() {
                this.notes.sort(function (a, b) {
                    // 최신순 정렬
                    return a.sortDate > b.sortDate? -1: a.sortDate < b.sortDate? 1: 0;
                });
            },
            sortOldest() {
                this.notes.sort(function (a, b) {
                    // 오래된순 정렬
                    return a.sortDate < b.sortDate? -1: a.sortDate > b.sortDate? 1: 0;
                    });
            },
            search(keyword) {
                this.searchMode = true;
                this.allMode=false;
                this.categoryMode=false;
                this.categoryNotes=[];


                console.log(keyword);
                // 제목과 내용에 대해서 검색
                let titleSearchResult = this
                    .notes
                    .filter((note) => note.title.includes(keyword));
                let textSearchResult = this
                    .notes
                    .filter((note) => note.text.includes(keyword));
                this.searchNotes = titleSearchResult.concat(textSearchResult);
                // 중복 제거
                this.searchNotes = this
                    .searchNotes
                    .filter((item, idx, array) => {
                        return array.indexOf(item) === idx;
                    });
                console.log(this.searchNotes);
            },
            searchReset() {
                this.searchNotes = [];
                this.searchMode = false;
                this.categoryMode = false;
                this.allMode=true;
            },
            showCategoryNote(title) {
                if(title === ''){
                    this.allMode=true;
                    this.categoryMode=false;
                    this.searchMode=false;
                    this.categoryNotes = []; 
                }
                // 카테고리 별 보기
                else{
                    this.allMode=false;
                    this.categoryMode=true;
                    this.searchMode=false;
                    this.categoryNotes = this.notes.filter((note) => note.category.title === title);
                }
                console.log(this.categoryNotes);

            },
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
                    this.$store.state.notes= newNotes;
                    localStorage.setItem("notes", JSON.stringify(newNotes));
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