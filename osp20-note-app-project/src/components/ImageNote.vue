<template>
<div>
  <v-card
    class="mx-auto"
    max-width="400"
    @click="password_dialog = note.secret"
  >
    <v-img
      class="white--text align-end"
      height="200px"
      src="../assets/image-preview.png"
      v-if="note.secret"
    >
    </v-img>
    <v-img
      class="white--text align-end"
      height="200px"
      :src="note.imgsrc"
      v-if="!note.secret"
    >
    </v-img>

    <v-card-subtitle class="pb-0" v-if="note.secret">
      비밀메모 입니다
    </v-card-subtitle>
        <v-card-subtitle class="pb-0" v-if="!note.secret">
      {{note.title}}
    </v-card-subtitle>

    <v-card-text class="text--primary">
      <p v-if="note.secret">메모를 클릭하여 비밀번호를 입력하고 메모를 잠금해제하세요</p>
      <p v-if="!note.secret">{{note.text}}</p>

    <div>
      <span v-if="note.secret===false" @click.prevent="modifyNote(note,index)"><i class="fas fa-edit"></i></span>
      <span  class="pl-2" v-if="note.secret===false" @click.prevent="deleteNote(note,index)"><i class="fas fa-times"></i></span>
    </div>
    </v-card-text>

  </v-card>
      <v-dialog v-model="password_dialog" max-width="500" color="white" persistent="persistent">
        <Password @password="checkPassword" @dialogClosed="password_dialog = false"></Password>
    </v-dialog>
  </div>
</template>

<script>
import Password from "./Password.vue";
export default {
    props: {
        note: Object,
    },
    data(){
      return{
        password_dialog: false,
        password : "",
      }
    },
    methods:{
      modifyNote(note){
        this.$emit('modifyNote',note);
      },
      deleteNote(note){
        this.$emit('deleteNote',note);
      },
      checkPassword(password){
        this.password = password;
        this.isSecret=this.note.secret;
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
    }

}
</script>

<style>

</style>