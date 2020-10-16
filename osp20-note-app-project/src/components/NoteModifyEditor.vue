<template>
    <v-container>
      <div class="dialog-div">
        <v-card solo="solo">
          <div class="dialog-div2">
            <v-row>
              <v-col cols="12" md="6">
                <v-card-title>Input Note</v-card-title>
                <v-divider></v-divider>
                <div class="note-editor mt-5">
                  <input
                    class="title-input"
                    type="text"
                    v-model="title"
                    placeholder="Title"
                  />
                  <textarea
                    rows="10"
                    v-model="text"
                    placeholder="Take a note..."
                  ></textarea>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <v-card-title>Color Pick</v-card-title>
                <v-divider></v-divider>
                <div style="text-align: -webkit-center">
                  <v-color-picker
                    justify="center"
                    v-model="theme"
                    class="mt-5"
                  ></v-color-picker>
                </div>
              </v-col>
            </v-row>
            <v-card-title>Options</v-card-title>
            <v-divider></v-divider>
            <v-row>
              <v-col cols="3">
                <div class="text-center">
                  <v-menu offset-y="offset-y" width="100">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        text="text"
                        color="black"
                        v-bind="attrs"
                        v-on="on"
                        outlined="outlined"
                        >Category</v-btn
                      >
                    </template>
                    <v-list>
                      <v-list-item-group v-model="select">
                        <v-list-item
                          v-for="(item, index) in category"
                          :key="index"
                          link="link"
                        >
                          <v-list-item-title>
                            {{ item.title }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
                </div>
              </v-col>
              <v-col cols="5">
                <p>BEFORE CATEGORY [ {{ beforeCategoryName }} ]</p>
                <p>SELECT CATEGORY [ {{ selectCategoryName }} ]</p>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      label="Secret Memo"
                      color="black"
                      v-model="secret"
                      hide-details="hide-details"
                    >
                    </v-checkbox>
                    <input
                      v-if="secret"
                      class="password-input"
                      type="text"
                      v-model="password"
                      placeholder="password"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-checkbox
                      label="Important Memo"
                      color="black"
                      v-model="important"
                      hide-details="hide-details"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-divider></v-divider>
            <v-row>
              <v-spacer></v-spacer>
              <v-col cols="5">
                <div class="note-editor-bottom">
                  <span>
                    <v-btn
                      text="text"
                      color="black"
                      class="write-btn"
                      @click="cancel"
                      outlined="outlined"
                      >CANCEL</v-btn
                    >
                  </span>
                  <span>
                    <v-btn
                      text="text"
                      color="black"
                      class="write-btn"
                      @click="createNew"
                      outlined="outlined"
                      >WRITE</v-btn
                    >
                  </span>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </div>
    </v-container>
</template>
<script>
export default {
  props: {
    modifyIndex: Number,
  },
  data() {
    return {
      // note 데이터 영역
      title: "",
      theme: "",
      text: "",
      secret: false,
      important: false,
      password: "",

      category: [],
      select: 0,
      selectCategoryName: "",
      beforeCategoryName: "",

      // 다이얼로그 제어
      dialog: false,

      startModify: true,
      index: null,
    };
  },
  // created() {
  //     this.category = this.$store.state.category;
  //     this.$store.state.category = JSON.parse(localStorage.getItem("category"));
  // },
  mounted() {
    this.index = this.modifyIndex;
    this.title = this.$store.state.notes[this.index].title;
    this.text = this.$store.state.notes[this.index].text;
    this.theme = this.$store.state.notes[this.index].theme;
    this.secret = this.$store.state.notes[this.index].secret;
    this.important = this.$store.state.notes[this.index].important;
    this.beforeCategoryName = this.$store.state.notes[
      this.index
    ].category.title;
    this.selectCategoryName = this.category[this.select].title;
  },
  updated() {
    // 아직 카테고리 수정 내용이 바로 적용되지는 않음.
    this.category = this.$store.state.category;
    this.selectCategoryName = this.category[this.select].title;
  },

  watch: {
    modifyIndex: {
      handler() {
        this.index = this.modifyIndex;
        this.title = this.$store.state.notes[this.index].title;
        this.text = this.$store.state.notes[this.index].text;
        this.theme = this.$store.state.notes[this.index].theme;
        this.secret = this.$store.state.notes[this.index].secret;
        this.important = this.$store.state.notes[this.index].important;
        this.beforeCategoryName = this.$store.state.notes[
          this.index
        ].category.title;
        this.selectCategoryName = this.category[this.select].title;

        this.startModify = true;
      },
    },

    secret: {
      handler() {
        if (this.secret == false) {
          this.password = "";
        }
      },
    },
  },
  methods: {
    createNew() {
      if (this.title == "") {
        alert("제목을 입력해주세요!");
      }
      if (this.title != "" && this.text == "") {
        alert("내용을 입력해주세요!");
      }
      if (this.secret && this.password == "") {
        alert("비밀번호를 입력해주세요!");
      }
      if (
        this.title != "" &&
        this.text != "" &&
        ((this.secret && this.password != "") ||
          (!this.secret && this.password == ""))
      ) {
        this.$emit("editorClose");

        var note = {
          title: this.title,
          text: this.text,
          theme: this.theme,
          date:
            new Date().toISOString().substr(0, 10) +
            " " +
            new Date().toTimeString().substr(0, 8),
          sortDate: new Date(),
          category: this.category[this.select],
          secret: this.secret,
          important: this.important,
        };

        // 노트 수정
        this.noteModified(note);

        this.select = 0;
      }
    },
    noteModified(note) {
      var modifyIndexData = this.index;
      this.$store.commit("updateNote", { note, modifyIndexData });
      this.$emit("redraw");
    },
    cancel() {
      this.$emit("editorClose");
      this.select = 0;
    },
  },
};
</script>
    <style>
.write-btn {
  margin: 10px;
}
.tag-input {
  margin-left: 10px;
}
.v-input--selection-controls {
  margin-top: 5px !important;
  padding: 0 !important;
}
</style>