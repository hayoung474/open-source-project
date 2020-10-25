<template>
  <div id="app">
    <v-app id="inspire">
      <app-header @search="search" @goHome="reset"></app-header>

      <v-container>
        <!-- 카테고리 목록 출력 -->
        <div class="text-center" style="margin: -10px">
          <span
            ><v-chip class="ma-2" style="background: #CFD8DC" @click="reset()">
              모든 메모
            </v-chip>
          </span>
          <span v-for="(category, index) in this.category" :key="index">
            <v-chip
              class="ma-2"
              :style="{ background: category.color }"
              @click="showCategoryNote(category.title)"
            >
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
                v-show="note.important === true"
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
          <div>
            <draggable
              class="row"
              v-model="noteViewList"
              :sort="true"
              @start="drag = true"
              @end="drag = false"
              group="people"
            >
              <v-col
                v-for="(note, index) in noteViewList"
                :key="`note-${index}`"
                cols="6"
                sm="4"
                md="3"
                v-show="note.important === false"
              >
                <v-hover v-slot="{ hover }">
                    <v-expand-transition name="note">
                            <Note
                            :note="note"
                            :index="index"
                            @modifyNote="modifyNote(note)"
                            @deleteNote="deleteNote(note)"
                            ></Note>
                            <div
                            v-if="hover"
                            class="d-flex transition-fast-in-fast-out"
                            ></div>
                    </v-expand-transition>
                </v-hover>
              </v-col>
            </draggable>
          </div>
        </div>

        <v-btn
          class="mx-2 calendar-button"
          fab="fab"
          color="#191e69"
          title="날짜별 메모 조회"
          @click="calendar_dialog = true"
        >
          <v-icon style="color: white"> mdi-calendar </v-icon>
        </v-btn>

        <v-btn
          class="mx-2 category-button"
          fab="fab"
          color="#191e69"
          title="카테고리 편집"
          @click="category_dialog = true"
        >
          <v-icon style="color: white"> mdi-format-list-bulleted </v-icon>
        </v-btn>

        <v-btn
          class="mx-2 sort-lastest-button"
          fab="fab"
          color="#191e69"
          title="최신순 정렬"
          @click="sortLastest"
        >
          <v-icon style="color: white"> mdi-chevron-up </v-icon>
        </v-btn>

        <v-btn
          class="mx-2 sort-oldest-button"
          fab="fab"
          color="#bc6d89"
          title="오래된 순 정렬"
          @click="sortOldest"
        >
          <v-icon style="color: white"> mdi-chevron-down </v-icon>
        </v-btn>

        <v-btn
          class="mx-2 add-button"
          fab="fab"
          color="#bc6d89"
          title="메모 추가"
          @click="
            dialog = true;"
        >
          <v-icon style="color: white"> mdi-plus </v-icon>
        </v-btn>

        <v-btn
          class="mx-2 refresh-button"
          fab="fab"
          color="#bc6d89"
          title="되돌리기"
          @click="reset"
        >
          <v-icon style="color: white"> mdi-refresh </v-icon>
        </v-btn>

        <v-dialog
          v-model="dialog"
          max-width="800"
          color="white"
          persistent="persistent"
        >
          <app-note-editor
            @editorClose="dialog = false"
            @redraw="redraw"
            @AddNote="AddNote"
          ></app-note-editor>
        </v-dialog>

        <v-dialog
          v-model="category_dialog"
          max-width="700"
          color="white"
          persistent="persistent"
        >
          <notecategory
            @dialogClosed="category_dialog = false"
            @deleteCategoryNote="deleteCategoryNote"
          ></notecategory>
        </v-dialog>

        <v-dialog
          v-model="dialog2"
          max-width="800"
          color="white"
          persistent="persistent"
        >
          <app-note-modify-editor
            :modifyIndex="modifyIndex"
            :selectNote="selectNote"
            @editorClose="dialog2 = false"
            @redraw="redraw"
            @ModifyNote="ModifyNote"
            :category="category"
          ></app-note-modify-editor>
        </v-dialog>

        <v-dialog
          ref="dialog"
          v-model="calendar_dialog"
          :return-value.sync="selectDate"
          persistent
          width="290px"
        >
          <v-date-picker v-model="selectDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="calendar_dialog = false">
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="
                calendar_dialog = false;
                showDateNote();
              "
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-container>
    </v-app>
  </div>
</template>
<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.15/lodash.min.js"></script>
<script>
import NoteEditor from "./components/NoteEditor.vue";
import NoteModifyEditor from "./components/NoteModifyEditor.vue";
import Category from "./components/Category.vue";
import Header from "./components/Header.vue";
import Note from "./components/Note.vue";
import draggable from "vuedraggable";

export default {
  name: "App",
  data: function () {
    return {
      dialog: false,
      dialog2: false,
      notes: [],
      noteViewList: [],
      category: [],
      isModify: false,
      modifyIndex: null,
      category_dialog: false,
      password_dialog: false,
      calendar_dialog: false,
      // allMode:true,
      categoryTitle: "",
      searchKeyword: "",
      selectDate: "",
      selectNote: "",
    };
  },
  methods: {
    AddNote(note) {
      this.notes.push(note);
      if (this.categoryTitle !== "") {
        this.noteViewList = this.notes.filter(
          (note) => note.category.title === this.categoryTitle
        );
      }
      else{
          this.noteViewList = this.notes;
      }
    },
    ModifyNote(selectNote, note) {
      this.notes[this.notes.indexOf(selectNote)] = note;
      localStorage.setItem("notes", JSON.stringify(this.notes));
      if (this.categoryTitle !== "") {
        this.noteViewList = this.notes.filter(
          (note) => note.category.title === this.categoryTitle
        );
      }
      else{
          this.noteViewList = this.notes;
      }
    },
    deleteNote(note) {
      if (confirm("정말로 삭제하시겠습니까?")) {
        this.notes.splice(this.notes.indexOf(note), 1);
      }
      if (this.categoryTitle !== "") {
        this.noteViewList = this.notes.filter(
          (note) => note.category.title === this.categoryTitle
        );
      }
      else{
          this.noteViewList = this.notes;
      }
    },
    modifyNote(note) {
      this.selectNote = note;
      this.modifyIndex = this.notes.indexOf(note);
      this.note = note;
      this.dialog2 = true;
    },
    sortLastest() {
      this.noteViewList.sort(function (a, b) {
        return a.sortDate > b.sortDate ? -1 : a.sortDate < b.sortDate ? 1 : 0;
      });
    },
    sortOldest() {
      this.noteViewList.sort(function (a, b) {
        return a.sortDate < b.sortDate ? -1 : a.sortDate > b.sortDate ? 1 : 0;
      });
    },
    search(keyword) {
      this.noteViewList = this.notes.filter(
        (note) => note.text.includes(keyword) || note.title.includes(keyword)
      );
    },
    showCategoryNote(title) {
      this.categoryTitle = title;
      this.noteViewList = this.notes.filter(
        (note) => note.category.title === title
      );
    },
    reset() {
      this.categoryTitle = "";
      this.noteViewList = this.notes;
    },
    redraw() {
      if (this.categoryTitle !== "") {
        this.noteViewList = this.notes.filter(
          (note) => note.category.title === this.categoryTitle
        );
      }
      if (this.categoryTitle === "") {
        this.noteViewList = this.notes;
      }
    },
    showDateNote() {
      this.noteViewList = this.notes.filter(
        (note) => note.date.substr(0, 10) === this.selectDate
      );
    },
    deleteCategoryNote(deleteCategory) {
      // 이곳에서는 해당 카테고리에 해당되는 메모를 모두 삭제
      this.notes = this.notes.filter(
        (note) => note.category.title !== deleteCategory.title
      );
    },
  },
  mounted() {
    if (localStorage.getItem("notes")) {
      this.notes = JSON.parse(localStorage.getItem("notes"));

    }
    if (localStorage.getItem("noteViewList")) {
        this.noteViewList = JSON.parse(localStorage.getItem("noteViewList"));
    }
    if (localStorage.getItem("category")) {
      this.category = JSON.parse(localStorage.getItem("category"));
    }
    if ((!localStorage.getItem("category") || JSON.parse(localStorage.getItem("noteViewList")).length===0)) {
      localStorage.setItem("category",
        JSON.stringify([{ title: "기본메모", color: "#CE93D8" }]));
    }
  },
  watch: {
    notes: {
      handler() {
        localStorage.setItem("notes", JSON.stringify(this.notes));

        // 카테고리가 선택이 되어 있는 경우에 재 배치
        if (this.categoryTitle !== "") {
          this.noteViewList = this.notes.filter(
            (note) => note.category.title === this.categoryTitle
          );
        }
      },
      deep: true,
    },
    noteViewList: {
      handler() {
        localStorage.setItem("noteViewList", JSON.stringify(this.noteViewList));
      },
    },
    category: {
      handler() {
        localStorage.setItem("category", JSON.stringify(this.category));
      },
    },
  },
  components: {
    appNoteEditor: NoteEditor,
    appHeader: Header,
    notecategory: Category,
    appNoteModifyEditor: NoteModifyEditor,
    Note,
    draggable,
    // Password,
  },
};
</script>

<style lang="scss">
@import "@/styles/global.scss";

.fade-enter-active, .fade-leave-active { transition: opacity .5s } .fade-enter, .fade-leave-to { opacity: 0 }
</style>
