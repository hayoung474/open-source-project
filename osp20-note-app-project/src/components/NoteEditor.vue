<template>
    <div>
        <v-container>
            <div>
                <v-card solo="solo">
                    <div class="ma-5">
                        <v-row >
                            <v-col cols="12" md="6">
                                <v-card-title>Input Note</v-card-title>
                                <v-divider></v-divider>
                                <div class="note-editor mt-5">
                                    <input class="title-input" type="text" v-model="title" placeholder="Title">
                                        <textarea rows="10" v-model="text" placeholder="Take a note..."></textarea>

                                    </div>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-card-title>Color Pick</v-card-title>
                                    <v-divider></v-divider>
                                    <div style="text-align: -webkit-center;">
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
                                                <p>{{selectCategoryName}}</p>
                                            </template>
                                            <v-list>
                                                <v-list-item-group v-model="select">
                                                    <v-list-item v-for="(item, index) in category" :key="index" link="link">
                                                        <v-list-item-title >
                                                            {{ item.title }}</v-list-item-title>
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
                                                @click="createNew"
                                                outlined="outlined">WRITE</v-btn>
                                        </span>
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </v-card>
                </div>
            </v-container>
        </div>
</template>
<script>

        export default {
            props:{
                index:String,
            },
            data() {
                return {
                    title: '',
                    theme: '',
                    text: '',
                    dialog: false,
                    secret: false,
                    important: false,
                    category: [],
                    select: 0,
                    selectCategoryName: ""
                }
            },
            created() {
                this.category = this.$store.state.category;
                localStorage.setItem("category", JSON.stringify(this.category));
                this.$store.state.category = JSON.parse(localStorage.getItem("category"));
            },
            updated() {
                this.category = this.$store.state.category;
                localStorage.setItem("category", JSON.stringify(this.category));

                this.selectCategoryName = this.$store.state.category[this.select].title;
            },
            methods: {
                createNew() {
                    if (this.title == '') {
                        alert("제목을 입력해주세요!");
                    }
                    if (this.title != '' && this.text == '') {
                        alert("내용을 입력해주세요!");
                    }
                    if (this.title != '' && this.text != '') {
                        this.dialog = false;
                        console.log(this.category);

                        var note = {
                            title: this.title,
                            text: this.text,
                            theme: this.theme,
                            date: new Date()
                                .toISOString()
                                .substr(0, 10),
                            category: this.category[this.select]
                        }
                        this.$emit('noteAdded', note);
                        this.title = '';
                        this.text = '',
                        this.theme = '';

                    }
                }
            }
        }
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