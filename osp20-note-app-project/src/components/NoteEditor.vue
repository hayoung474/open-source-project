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
                                                <p>{{category}}</p>
                                            </template>
                                            <v-list>
                                                <v-list-item-group v-model="category">
                                                    <v-list-item v-for="(item, index) in items" :key="index" link="link">
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
            data() {
                return {
                    title: '',
                    theme: '',
                    text: '',
                    dialog: false,
                    secret: false,
                    important: false,
                    category: '',

                    items: [
                        {
                            title: 'aaa'
                        }, {
                            title: 'bbb'
                        }, {
                            title: 'ccc'
                        }, {
                            title: 'ddd'
                        }
                    ]
                }
            },
            methods: {
                createNew() {
                    if(this.title==''){
                        alert("제목을 입력해주세요!");
                    }
                    if(this.title!='' && this.text==''){
                        alert("내용을 입력해주세요!");
                    }
                    if(this.title!='' && this.text!=''){
                        this.dialog = false;
                        console.log(this.category);
                        this.$emit('noteAdded', this.title, this.text, this.theme, this.dialog);
                        this.title = '';
                        this.text = '',
                        this.theme = '';
                    }
                },

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