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
            :style="{ 'background-color': note.theme }"
          >
            <div>
              <span>
                <strong>{{ note.title }}</strong>
              </span>
              <span class="modify">
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
        @click="category_dialog = true"
      >
        <v-icon dark="dark"> mdi-format-list-bulleted </v-icon>
      </v-btn>

      <v-btn
        class="mx-2 account-button"
        fab="fab"
        dark="dark"
        color="black"
      >
        <v-icon dark="dark"> mdi-account </v-icon>
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

      <v-dialog v-model="dialog" max-width="800" color="white">
        <app-note-editor
          @noteAdded="newNote"
          @noteModified="ModifyNote"
        ></app-note-editor>
      </v-dialog>

       <notecategory v-if=category_dialog
        @dialogClosed="category_dialog=false"
       ></notecategory> 


    </v-app>
  </div>
</template>

<script>
import NoteEditor from "./components/NoteEditor.vue";
import Header from "./components/Header.vue";
import Category from "./components/Category.vue";
import Vue from "vue";
import { VueMasonryPlugin } from "vue-masonry";
Vue.use(VueMasonryPlugin);

export default {
  name: "App",
  data: function () {
    return {
      dialog: false,
      category_dialog: false,
      editorOpen: false,
      notes: [],
    };
  },
  computed: {},
  methods: {
    newNote(note, CloseEditor) {
      this.dialog = CloseEditor;
      this.$store.commit("addNote",note);
      this.notes = this.$store.state.notes;
    },
    deleteNote(index) {
      this.notes.splice(index, 1);
    },
  },
  mounted() {
    if (localStorage.getItem("notes"))
      this.$store.state.notes= JSON.parse(localStorage.getItem("notes"));
      this.notes = this.$store.state.notes;
  },
  watch: {
    notes: {
      handler() {
        var newNotes = this.notes;
        localStorage.setItem("notes", JSON.stringify(newNotes));
      },
      deep: true,
    },
  },
  components: {
    appNoteEditor: NoteEditor,
    appHeader: Header,
    notecategory: Category,
  },
};
</script>

<style lang="scss">
@import "@/styles/global.scss";
</style>