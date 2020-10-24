<template>
<div>
    <v-card class="pa-5" elevation="3" :color="note.theme" style="width:100%;" @click="password_dialog = note.secret">
        <v-row>
            <v-col cols="10">
                <strong class="title" v-if="note.secret===false">{{ note.title }}</strong>
                <strong class="title" v-if="note.secret===true">비밀메모입니다</strong>
            </v-col>
            <v-col cols="1" v-if="note.important && !note.secret">
                <span class="importantonly">
                    <v-icon>mdi-pin</v-icon>
                </span>
            </v-col>
            <v-col cols="1" v-if="note.secret && !note.important">
                <span class="secretonly">
                    <i class="fas fa-lock"></i>
                </span>
            </v-col>
            <v-col cols="1" v-if="note.secret && note.important">
                <span class="importantsecret">
                        <v-icon>mdi-pin</v-icon>
                    <span style="padding-left: 10px">
                        <i class="fas fa-lock"></i>
                    </span>
                </span>
            </v-col>
            <v-col cols="1">
                <span class="modify" v-if="note.secret===false" @click.prevent="modifyNote(note,index)">
                    <i class="fas fa-edit"></i>
                </span>
            </v-col>
            <v-col cols="1">
                <span class="delete" v-if="note.secret===false" @click.prevent="deleteNote(note,index)">
                    <i class="fas fa-times"></i>
                </span>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" v-if="note.secret===false">
                <vue-markdown :source="note.text" style="white-space: pre-line;height:160px;overflow:auto;"></vue-markdown>
            </v-col>
            <v-col v-if="note.secret===true">
                <p class="note-text" style="white-space: pre-line;height:160px;overflow:auto;" >메모를 클릭하여 비밀번호를 입력하고 메모를 잠금해제하세요</p>
            </v-col>
        </v-row>
        <v-row>
            <v-spacer></v-spacer>
            <v-col cols="12" justify="end">
                <p class="text-right" style="margin-bottom: 0px !important; font-size: 13px">
                    {{ note.category.title}}
                </p>
                <p class="text-right" style="margin-bottom: 0px !important; font-size: 13px">
                    {{ note.date }}
                </p>
            </v-col>
        </v-row>
    </v-card>

    <v-dialog v-model="password_dialog" max-width="500" color="white" persistent="persistent">
        <Password @password="checkPassword" @dialogClosed="password_dialog = false"></Password>
    </v-dialog>
    </div>
</template>

<script>
    import VueMarkdown from 'vue-markdown'
    import Password from "./Password.vue";
    export default {
        props: {
            note: Object,
            index: Number,
        },
        data() {
            return {
                modifyNote(note){
                    this.$emit('modifyNote',note);
                },
                deleteNote(note){
                    this.$emit('deleteNote',note);
                },
                password_dialog: false,
                password : "",
                
            }
        },
        methods: {
            checkPassword(password){
                this.password = password;
                if(this.password === this.note.password){
                    this.note.secret=false;
                }
                else{
                    alert("비밀번호가 틀렸습니다!");
                    this.note.secret=true;
                }
            },
        },      
        components: {
            Password,
            VueMarkdown
        }
    }
</script>


<style>
body{ -ms-overflow-style: none; } 
::-webkit-scrollbar { display: none; }

@font-face{
    font-family:"SCDream3";
    src:url("../assets/font/SCDream3.otf");
}
.title{
    text-decoration:underline;
}
p{
    font-family: "SCDream3";

}
</style>
