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
                                <input class="title-input" type="text" v-model="title" placeholder="Title"/>
                                <!-- <div class="editor-text" contenteditable="true" placeholder="Take a note..." ref="text"><strong>dasdasdasds</strong><mark>dasds</mark></div> -->
                                 <textarea rows="10" v-model="text" placeholder="Take a note..."></textarea>
                                <v-btn-toggle v-model="formatting">
                                    <v-btn @click="text=text+' *Take a note...* '">
                                        <v-icon>mdi-format-italic</v-icon>
                                    </v-btn>

                                    <v-btn @click="text=text+' **Take a note...**'">
                                        <v-icon>mdi-format-bold</v-icon>
                                    </v-btn>
                                    <v-btn @click="text=text+' <u> Take a note... </u> '">
                                        <v-icon>mdi-format-underline</v-icon>
                                    </v-btn>
                                    <v-btn @click="text=text+' - Take a note...'">
                                        <v-icon>mdi-format-list-bulleted</v-icon>
                                    </v-btn>
                                    <v-btn @click="text=text+' ~~ Take a note... ~~'">
                                        <v-icon>mdi-format-strikethrough</v-icon>
                                    </v-btn>

                                </v-btn-toggle>
                                <p style="font-size:15px;">해당 에디터는 MarkDown 문법을 제공합니다.</p>
                            </div>
                            
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-card-title>Color Pick</v-card-title>
                            <v-divider></v-divider>
                            <div style="text-align: -webkit-center">
                                <v-color-picker justify="center" v-model="theme" class="mt-5"></v-color-picker>
                            </div>
                        </v-col>
                    </v-row>
                    <v-card-title>Options</v-card-title>
                    <v-divider></v-divider>
                    <v-row>
                        <v-col cols="4">
                            <div class="text-center">
                                <v-menu offset-y="offset-y">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-btn text="text" color="black" v-bind="attrs" v-on="on" outlined="outlined">
                                            Category
                                        </v-btn>
                                        <p>{{ selectCategoryName }}</p>
                                    </template>
                                    <v-list>
                                        <v-list-item-group v-model="select">
                                            <v-list-item v-for="(item, index) in category" :key="index" link="link">
                                                <v-list-item-title>
                                                    {{ item.title }}</v-list-item-title >
                                            </v-list-item>
                                        </v-list-item-group>
                                    </v-list>
                                </v-menu>
                            </div>
                        </v-col>
                        <v-col cols="4">
                            <v-checkbox
                                label="Secret Memo"
                                color="black"
                                v-model="secret"
                                hide-details="hide-details"></v-checkbox>
                            <input
                                v-if="secret"
                                class="password-input"
                                type="text"
                                v-model="password"
                                placeholder="password"/>
                        </v-col>
                        <v-col cols="4">
                            <v-checkbox
                                label="Important Memo"
                                color="black"
                                v-model="important"
                                hide-details="hide-details"></v-checkbox>
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
                                        outlined="outlined">CANCEL</v-btn >
                                </span>
                                <span>
                                    <v-btn
                                        text="text"
                                        color="black"
                                        class="write-btn"
                                        @click="createNew"
                                        outlined="outlined">WRITE</v-btn >
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
            modifyIndex: Number
        },
        data() {
            return {
                title: "",
                theme: "",
                text: "",
                secret: false,
                important: false,
                password: "",

                category: [],
                select: null,
                selectCategoryName: "",

                // dialog: false,
            };
        },
        // created() {       this.$store.state.category =
        // JSON.parse(localStorage.getItem("category"));       this.category =
        // this.$store.state.category; },
        updated() {
            this.category = this.$store.state.category;
            this.selectCategoryName = this
                .category[this.select]
                .title;
        },

        methods: {
            // test(){
            //     console.log(this.$refs.text);
            //     var text = document.createTextNode("dasdsadas");
            //     var del = document.createElement("del");
            //     del.appendChild(text);
            //     this.$refs.text.appendChild(del);
                
            // },
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
                if (this.title != "" && this.text != "" && ((this.secret && this.password != "") || (!this.secret && this.password == ""))) {

                    // this.dialog = false; 선택한 카테고리가 없을 경우 최상단 카테고리 자동 지정
                    if (this.isEmpty(this.select)) {
                        this.select = 0;
                    }

                    // 날짜 지정 시간대 조정
                    var timezoneOffset = new Date().getTimezoneOffset() * 60000;
                    var timezoneDate = new Date(Date.now() - timezoneOffset);

                    var note = {
                        title: this.title,
                        text: this.text,
                        theme: this.theme,
                        date: timezoneDate
                            .toISOString()
                            .substr(0, 10) + " " + new Date()
                            .toTimeString()
                            .substr(0, 8),
                        sortDate: new Date(),
                        category: this.category[this.select],
                        secret: this.secret,
                        important: this.important,
                        password: this.password
                    };

                    // 노트 추가
                    this.$emit('AddNote', note);

                    this.title = "";
                    this.text = "";
                    this.theme = "";
                    this.select = 0;
                    this.secret = false;
                    this.important = false;
                    this.password = "";

                    this.$emit("editorClose");
                }
            },
            // noteAdd(note) {   console.log(new Date().toISOString());
            // this.$emit("editorClose");   this.$store.commit("addNote", note); },
            cancel() {
                this.title = "";
                this.text = "";
                this.theme = "";
                this.select = 0;
                this.secret = false;
                this.important = false;
                this.password = "";

                this.$emit("editorClose");
            },

            isEmpty(str) {

                if (typeof str == "undefined" || str == null || str == "") 
                    return true;
                else 
                    return false;
                }
            },

        // mounted() {   if (localStorage.getItem("category")) {
        // this.$store.state.category = JSON.parse(localStorage.getItem("category"));
        // this.category = this.$store.state.category;   } },

        watch: {
            category: {
                handler() {
                    var newCategory = this.category;
                    localStorage.setItem("category", JSON.stringify(newCategory));
                },
                deep: true
            },
            modifyIndex: {
                handler() {
                  this.index = this.modifyIndex;
                  this.title = this .$store .state .notes[this.modifyIndex] .title;
                  this.text = this .$store .state .notes[this.modifyIndex] .text;
                  this.theme = this .$store .state .notes[this.modifyIndex] .theme;
                  this.secret = this .$store .state .notes[this.modifyIndex] .secret;
                  this.important = this .$store .state .notes[this.modifyIndex] .important;
                }
            },
            secret: {
                handler() {
                    if (this.secret == false) {
                        this.password = "";
                    }
                }
            }
        }
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
    .editor-text{
        height:15em;
    }
    [contenteditable] {
        outline: 0px solid transparent;
    }
</style>