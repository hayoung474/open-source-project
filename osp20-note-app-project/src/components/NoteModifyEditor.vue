<template>
    <v-container>
      <div class="dialog-div">
        <v-card solo="solo">
          <div class="dialog-div2">
            <v-row>
              <v-col cols="12" md="6">
                <v-card-title>Input Note</v-card-title>
                <v-divider></v-divider>
                <div class="note-editor mt-5" :style="{background: theme}">
                  <input
                    :style="styleObject" 
                    class="title-input"
                    type="text"
                    v-model="title"
                    placeholder="Title"
                  />
                  <textarea
                    :style="styleObject" 
                    rows="10"
                    v-model="text"
                    placeholder="Take a note..."
                  ></textarea>
                  <v-btn-toggle v-model="toggle_none">
                      <v-btn @click="text=text+' **input**'">
                          <v-icon>mdi-format-bold</v-icon>
                      </v-btn>
                      <v-btn @click="text=text+' *input* '">
                          <v-icon>mdi-format-italic</v-icon>
                      </v-btn>
                      <v-btn @click="text=text+' <u> input </u> '">
                          <v-icon>mdi-format-underline</v-icon>
                      </v-btn>
                      <v-btn @click="text=text+' ~~input~~'">
                          <v-icon>mdi-format-strikethrough</v-icon>
                      </v-btn>
                      <v-btn @click="text=text+' - input'">
                          <v-icon>mdi-format-list-bulleted</v-icon>
                      </v-btn>
                  </v-btn-toggle>
                  <p style="font-size:12px;" :style="styleObject">버튼을 누르고 input 위치에 원하는 메시지를 작성하세요.</p>
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
                <div class="text-center" style="margin-top: -5px;">
                <span v-for="(color, index) in historyColor" :key="index">
                    <v-btn
                    class="colorbtn"
                    x-small
                    icon
                    :color=color.rgb
                    @click="(theme=color.rgb)"
                    >
                    <v-icon>mdi-circle</v-icon>
                    </v-btn>
                </span>
                </div>
                <div class="mt-5">
                  <p><input type="file" id="imgfile" class="inputfile" v-on:change="upload" accept="image/*"><label for="file" class="input-plus"></label>
                  <span @click.prevent="predict" style="cursor:pointer; margin-left:10px;"><v-icon color="#dfdfdf">fas fa-search</v-icon></span>
                  </p>
                </div>
                <div style="text-align: -webkit-center;">
                  <img :src="imgsrc" id="image" style="width:70%"/>
                  <p>{{predicted}}</p>
                </div>
                <div style="text-align: -webkit-right; margin-right: 50px;">
                    <span v-if="(imgsrc!='')" @click="deleteImgfile">
                    <v-icon style="cursor:pointer;">mdi-close</v-icon>
                    </span>
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
                <p>SELECT CATEGORY [ {{ category[select].title }} ]</p>
              </v-col>
              <v-col cols="4">
                <v-row>
                  <v-col cols="12">
                    <v-switch
                      label="Secret Memo"
                      color="secondary"
                      v-model="mSecret"
                      hide-details
                      @click="secret=(!secret)"
                    ></v-switch>
                    <input
                      v-if="secret"
                      class="password-input"
                      type="text"
                      v-model="password"
                      placeholder="password"
                    />
                  </v-col>
                  <v-col cols="12">
                  <v-switch
                    label="Important Memo"
                    color="secondary"
                    v-model="mImportant"
                    hide-details
                    @click="important=(!important)"
                  ></v-switch>
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
import * as cocoSSD from '@tensorflow-models/coco-ssd'
import * as tf from '@tensorflow/tfjs'
let model;
export default {
  props: {
    modifyIndex: Number,
    selectNote:Object,
    category:Array,
    historyColor:Array,
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
      imgsrc: "",
      predicted:"",      

      // category: [],
      select: 0,
      beforeCategoryName: "",
      styleObject:{
        color:'black'
      },

      // historyColor: [],
      toggle_none: null,
      mSecret: null,
      mImportant: false,
      // 다이얼로그 제어
      dialog: false,

      startModify: true,
      index: null,
      beforeNote:"",
    };
  },
  async mounted() {
    this.title = this.selectNote.title;
    this.text = this.selectNote.text;
    this.theme = this.selectNote.theme;
    this.secret = this.selectNote.secret;
    this.important = this.selectNote.important;
    this.beforeCategoryName = this.selectNote.category.title;
    this.selectCategoryName = this.category[this.select].title;
    this.imgsrc = this.selectNote.imgsrc;
    console.log(this.imgsrc)
    this.predicted = this.selectNote.predicted;
    this.mImportant = this.important;
    document.getElementById("imgfile").value="";
    console.log(this.selectNote);
    this.historyColor = JSON.parse(localStorage.getItem("historyColor"));
    model = await cocoSSD.load();

    
  },
  watch: {
    selectNote:{
      handler(){
        console.log(this.selectNote);
        this.title = this.selectNote.title;
        this.text = this.selectNote.text;
        this.theme = this.selectNote.theme;
        this.secret = this.selectNote.secret;
        this.important = this.selectNote.important;
        this.beforeCategoryName = this.selectNote.category.title;
        this.selectCategoryName = this.category[this.select].title;
        this.imgsrc = this.selectNote.imgsrc;
        this.predicted = this.selectNote.predicted;     
        this.mImportant = this.important;
      },
    },
    theme:{
      handler(){
        var rgbColor = this.hexToRgb(this.theme).split(',');
        for(var i=0;i<rgbColor.length;i++){
            if(rgbColor[i] < 100){
                this.isDarkNote=true;
            }
            else{
                this.isDarkNote=false;
            }
        }
        if(this.isDarkNote === true){
            this.styleObject.color='white'
        }
        else{
            this.styleObject.color='black'
        }
      }
  },
    secret: {
      handler() {
        if (this.secret == false) {
          this.password = "";
          this.mSecret = null;
        }
      },
    },
    imgsrc: {
      handler() {
        if (this.imgsrc == '') {
          this.predicted = "";
        }
      },
    },
    historyColor: {
      handler() {
        localStorage.setItem("historyColor", JSON.stringify(this.historyColor));
      },
    },
  },
  methods: {
    hexToRgb(hexType){ 

      var hex = hexType.replace( "#", "" ); 
      var value = hex.match( /[a-f\d]/gi ); 

      // 헥사값이 세자리일 경우, 여섯자리로. 
      if ( value.length == 3 ) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2]; 
      value = hex.match( /[a-f\d]{2}/gi ); 

      var r = parseInt( value[0], 16 ); 
      var g = parseInt( value[1], 16 ); 
      var b = parseInt( value[2], 16 ); 

      var rgbType =  r + "," + g + "," + b; 

      return rgbType; 
    },
    upload (e){
        let file = e.target.files;
        let reader = new FileReader();

        reader.readAsDataURL(file[0]);
        reader.onload = e => {
            this.imgsrc = e.target.result;
            console.log(this.imgsrc)
        }
    },
    async predict(){
      if (this.imgsrc != ''){
          const img = document.getElementById("image");      
          console.log(img) 
          let tmp = await model.detect(img);  
          this.predicted = tmp[0].class
      }
      else{
          alert("이미지를 업로드해주세요!");
      }
    },
    deleteImgfile(){
      this.imgsrc='';
      document.getElementById("imgfile").value="";
    },                
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

        // 선택한 카테고리가 없을 경우 최상단 카테고리 자동 지정
        if(this.isEmpty(this.select)){
          this.select=0;
        }
        // 날짜 지정 시간대 조정
        var timezoneOffset = new Date().getTimezoneOffset() * 60000; 
        var timezoneDate = new Date(Date.now() - timezoneOffset);


        var note = {
          title: this.title,
          text: this.text,
          theme: this.theme,
          date:timezoneDate.toISOString().substr(0, 10) + " " + new Date().toTimeString().substr(0, 8),
          sortDate: new Date().toString(),
          category: this.category[this.select],
          secret: this.secret,
          important: this.important,
          password: this.password,
          imgsrc: this.imgsrc,
          predicted:this.predicted,
          
        };

        // 노트 추가 
        this.$emit('ModifyNote',this.selectNote,note);

        this.title = "";
        this.text = "";
        this.select = 0;
        this.secret = false;
        this.important = false;
        this.password = "";
        this.imgsrc = "";
        this.predicted="";
        document.getElementById("imgfile").value="";
        this.toggle_none = null;

        this.$emit("editorClose");
      }
    },
    cancel() {
      this.imgsrc = this.selectNote.imgsrc;
      this.$emit("editorClose");
      document.getElementById("imgfile").value="";
      this.toggle_none = null;
      this.mImportant = this.important;
    },
    isEmpty(str){
         
        if(typeof str == "undefined" || str == null || str == "")
            return true;
        else
            return false ;
    }
  },
};
</script>

<style>
.colorbtn {
    box-shadow: 0px 0px 2px #8c8c8c; 
    margin: 15px 5px 0px 5px; 
}
.inputfile{
    width: 70%;
    margin-left: 35px;
    outline: none;
}
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