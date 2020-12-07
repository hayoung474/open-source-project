<template>
  <div>
    <v-card solo="solo">
      <div class="category-div">
        <v-row>
          <v-col cols="12">
            <span><v-card-title>Category</v-card-title></span>
            <span class="close" @click="closeDialog">
              <i class="fas fa-times"></i>
            </span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <div class="recommend">
          <v-row>
            <v-col cols="12">
              <span @click="recommendCategoryCreate">
                <v-icon color="#faff85" style="cursor:pointer;">mdi-star-four-points-outline</v-icon>
                <p style="font-size:12px;">이미지 메모를 기반으로 한 추천 카테고리를 생성할 수 있습니다!<br>위의 아이콘을 클릭하면 자동 분류가 됩니다.</p>
              </span>
            </v-col>
          </v-row>
          <div id="recommend-category-list">
              <span v-for="(category, index) in recommendCategoryList" :key="index">
                  <v-btn class="recommend-category-btn"
                  :color="'#' + Math.round(Math.random() * 0xffffff).toString(16)"
                  @click="createRecommendCategory(category.name)"
                  >
                  {{category}}
                  </v-btn>
              </span>
          </div>
        </div>

        <v-divider></v-divider>
      </div>
      <div class="category-content">
        <v-row>
          <v-col cols="12">
            <span
              ><input
                class="category-input"
                type="text"
                size="60%"
                v-model="name"
                placeholder="Name"
              />
            </span>
            <span class="category-add" @click="createCategory">
              <i class="fas fa-plus"></i>
            </span>
          </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12">
            <li
              class="category-list"
              v-for="(category, index) in category"
              :key="index"
            >
              {{ category.title }}
              <span class="category-delete" @click="deleteCategory(index)">
                <i class="fas fa-times"></i>
              </span>
            </li>
            <br />
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script>
import firebase from "firebase";
export default {
  data() {
    return {

      currentUser:{},
      name: "",
      
      category_dialog: true,
      notes: [],
      category: [],
      recommendCategoryList: [],
      isSame: false,
      person: ["person"],
      vehicle: [
        "bicycle",
        "car",
        "motorcycle",
        "airplane",
        " bus",
        "train",
        "truck",
        "boat",
      ],
      outsideThing: ["traffic light", "fire hydrant", "parking meter", "bench"],
      animal: [
        "bird",
        "cat",
        "dog",
        "horse",
        "sheep",
        "cow",
        "elephant",
        "bear",
        "zebra",
        "giraffe",
      ],
      clothes: ["backpack", "handbag", "tie", "suitcase"],
      things: [
        "umbrella",
        "bowl",
        "spoon",
        "knife",
        "fork",
        "wine",
        "glass",
        "cup",
        "bottle",
        "chair",
        "couch",
        "potted plant",
        "bed",
        "dining table",
        "toilet",
        "book",
        "clock",
        "vase",
        "scissors",
        "teddy bear",
        "toothbrush",
      ],
      electronic: [
        "tv",
        "laptop",
        "mouse",
        "remote",
        "keyboard",
        "cell phone",
        "microwave",
        "oven",
        "toaster",
        "sink",
        "refrigerator",
      ],
      sport: [
        "snowboard",
        "sportball",
        "kite",
        "baseball bat",
        "baseball glove",
        "skateboard",
        "tennis racket",
      ],
      fruit: ["banana", "apple", "orange"],
      food: [
        "carrot",
        "sandwich",
        "hot dog",
        "pizza",
        "donut",
        "cake",
        "broccoli",
      ],
    };
  },
  methods: {
    closeDialog() {
      this.category_dialog = false;
      this.$emit("dialogClosed", this.category_dialog);
      //window.location.reload();
    },

    createCategory() {
      if (this.name == "") alert("카테고리 이름을 적어주세요!");
      else {
        var newCategory = {
          color: "#" + Math.round(Math.random() * 0xffffff).toString(16),
          title: this.name,
        };

        for (var i = 0; i < this.category.length; i++) {
          if (this.category[i].title === newCategory.title) {
            alert("동일한 카테고리 이름이 존재합니다!");
            this.isSame = true;
            break;
          }
        }
        if (!this.isSame) {
          this.category.push(newCategory);
          firebase.database().ref('users/').child("category").child(this.currentUser.uid).set(this.category);
        } else {
          this.isSame = false;
        }
        this.name = "";
      }
    },
    createRecommendCategory(name) {
      var newCategory = {
        title: name,
        color: "#" + Math.round(Math.random() * 0xffffff).toString(16),
      };

      for (var i = 0; i < this.category.length; i++) {
        if (this.category[i].title === newCategory.title) {
          alert("동일한 카테고리 이름이 존재합니다!");
          this.isSame = true;
          break;
        }
      }
      if (!this.isSame) {
        this.category.push(newCategory);
        firebase.database().ref('users/').child("category").child(this.currentUser.uid).set(this.category);
        
      } else {
        this.isSame = false;
      }

      for (var j = 0; j < this.notes.length; j++) {
        if (this.notes[j].category.title === "기본메모") {
          if (
            this.outsideThing.includes(this.notes[j].predicted) &&
            newCategory.title === "바깥사물"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.person.includes(this.notes[j].predicted) &&
            newCategory.title === "인물"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.animal.includes(this.notes[j].predicted) &&
            newCategory.title === "동물"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.electronic.includes(this.notes[j].predicted) &&
            newCategory.title === "전자제품"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.vehicle.includes(this.notes[j].predicted) &&
            newCategory.title === "이동수단"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.clothes.includes(this.notes[j].predicted) &&
            newCategory.title === "의류"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.things.includes(this.notes[j].predicted) &&
            newCategory.title === "사물"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.sport.includes(this.notes[j].predicted) &&
            newCategory.title === "스포츠"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.fruit.includes(this.notes[j].predicted) &&
            newCategory.title === "과일"
          ) {
            this.notes[j].category = newCategory;
          }
          if (
            this.food.includes(this.notes[j].predicted) &&
            newCategory.title === "음식"
          ) {
            this.notes[j].category = newCategory;
          }
        }
      }
      firebase.database().ref('users/').child("test").child(this.currentUser.uid).set(this.notes);
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    deleteCategory(index) {
      if (this.category[index].title === "기본메모") {
        alert("기본메모는 삭제가 불가능 합니다.");
      } else {
        if (
          confirm(
            "카테고리 삭제시 해당 카테고리 메모도 모두 삭제 됩니다. 삭제 하시겠습니까?"
          )
        ) {
          let deleteCategory = this.category[index];
          this.$emit("deleteCategoryNote", deleteCategory);

          this.category.splice(index, 1);
          firebase.database().ref('users/').child("category").child(this.currentUser.uid).set(this.category);
          alert("삭제되었습니다.");
          for(var i=0;i<this.category.length;i++){
            var header = document.querySelector("h1");	//제거하고자 하는 엘리먼트
            header.parentNode.removeChild(header);
          }
        }
      }
    },

    recommendCategoryCreate() {
      var element = document.getElementById("recommend-category-list");
      this.recommendCategoryList=[]
      // 먼저 로컬스토리지에 있는 노트를 순회할 것
      var tempNoteList = [];
      if (localStorage.getItem("notes")) {
        this.notes = JSON.parse(localStorage.getItem("notes"));
        this.tempNoteList = this.notes.filter((note) => note.imgsrc !== "");
      }

      for (var i = 0; i < this.tempNoteList.length; i++) {
        if (this.person.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("인물"))
            this.recommendCategoryList.push("인물");
        }
        if (this.vehicle.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("이동수단"))
            this.recommendCategoryList.push("이동수단");
        }
        if (this.outsideThing.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("바깥사물"))
            this.recommendCategoryList.push("바깥사물");
        }
        if (this.animal.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("동물"))
            this.recommendCategoryList.push("동물");
        }
        if (this.clothes.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("의류"))
            this.recommendCategoryList.push("의류");
        }
        if (this.things.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("사물"))
            this.recommendCategoryList.push("사물");
        }
        if (this.electronic.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("전자제품"))
            this.recommendCategoryList.push("전자제품");
        }
        if (this.sport.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("스포츠"))
            this.recommendCategoryList.push("스포츠");
        }
        if (this.fruit.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("과일"))
            this.recommendCategoryList.push("과일");
        }
        if (this.food.includes(this.tempNoteList[i].predicted)) {
          if (!this.recommendCategoryList.includes("음식"))
            this.recommendCategoryList.push("음식");
        }
      }

      console.log(this.recommendCategoryList);
      

      // for (var j = 0; j < this.recommendCategoryList.length; j++) {
      //   var color = "#" + Math.round(Math.random() * 0xffffff).toString(16);
      //   var btn = document.createElement("BUTTON");
      //   btn.innerHTML = this.recommendCategoryList[j];
      //   btn.className = "recommend-category-btn";
      //   btn.style.background = color;
      //   btn.addEventListener("click", (e) => {
      //     this.createRecommendCategory(e.target.innerHTML);
      //   });
      //   element.appendChild(btn);
      // }
    },
  },

  mounted() {
    if (localStorage.getItem("category")) {
      this.category = JSON.parse(localStorage.getItem("category"));
    }
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = {};
      }
    });
  },

  watch: {
    category: {
      handler() {
        localStorage.setItem("category", JSON.stringify(this.category));
      },
    },
  },
};
</script>
<style>
.recommend{
  margin-left: 15px;
  margin-bottom: 5px;
}
.recommend-category-btn {
  background-color: black;
  color: white;
  margin: 10px;
  padding: 5px;
  border-radius: 10px;
  height: 30px;
  width: 100px;
  font-size: 12px;
}
.recommend{
  margin-left: 15px;
  margin-bottom: 5px;
}

</style>
