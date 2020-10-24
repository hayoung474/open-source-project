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
              <span
                class="category-delete"
                @click="deleteCategory(index)"
                
              >
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
export default {
  data() {
    return {
      name: "",
      category_dialog: true,
      category: [],
      isSame:false,
    };
  },
  methods: {
    closeDialog() {
      this.category_dialog = false;
      this.$emit("dialogClosed", this.category_dialog);
      window.location.reload();
    },

    createCategory() {
      if (this.name == "") alert("카테고리 이름을 적어주세요!");
      else {
        var newCategory = { title: this.name, color: "#" + Math.round(Math.random() * 0xffffff).toString(16)};

        for (var i = 0; i < this.category.length; i++) {
          if(this.category[i].title === newCategory.title){
            alert("동일한 카테고리 이름이 존재합니다!");
            this.isSame=true;
            break;
          }
        }
        if(!this.isSame){
          this.category.push(newCategory);
        }
        else{
          this.isSame=false
        }
        this.name="";
        
      }
    },

    deleteCategory(index) {
      if(confirm("카테고리 삭제시 해당 카테고리 메모도 모두 삭제 됩니다. 삭제 하시겠습니까?")){
        
        let deleteCategory = this.category[index];
        this.$emit("deleteCategoryNote",deleteCategory);

        this.category.splice(index, 1);
        alert("삭제되었습니다.");
      }
    },
  },

  mounted() {
    if (localStorage.getItem("category")) {
      this.category =  JSON.parse(localStorage.getItem("category"));
    }
  },
  
  watch: {
    category: {
      handler() {
        console.log(this.category)
        localStorage.setItem("category", JSON.stringify(this.category));
      },
    },
  },
};
</script>