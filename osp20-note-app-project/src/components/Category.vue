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
              v-for="(category, index) in this.$store.state.category"
              :key="index"
            >
              {{ category.title }}
              <span
                class="category-delete"
                @click.prevent="deleteCategory(index)"
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
        this.category = this.$store.state.category;
        var newCategory = { title: this.name, color: "#" + Math.round(Math.random() * 0xffffff).toString(16)};
        console.log(newCategory);
        this.$store.commit('addCategory',newCategory)
       
        // this.category.push({ title: this.name });
        // localStorage.setItem("category", JSON.stringify(this.category));
        // this.$store.state.category = JSON.parse(
        //   localStorage.getItem("category")
        // );
        
        this.name = "";
      }
    },

    deleteCategory(index) {
      this.category = this.$store.state.category;
      this.$store.commit('deleteCategory',index);
      
      // vuex 꺼 쓰기
      // this.category.splice(index, 1);
      // localStorage.setItem("category", JSON.stringify(this.category));
      // this.$store.state.category = JSON.parse(localStorage.getItem("category"));
      // console.log(this.category);
    },
  },

  mounted() {
    if (localStorage.getItem("category")) {
      this.$store.state.category = JSON.parse(localStorage.getItem("category"));
      this.category = this.$store.state.category;
    }
  },

  watch: {
    category: {
      handler() {
        var newCategory = this.category;
        localStorage.setItem("category", JSON.stringify(newCategory));
        this.$store.state.category = newCategory ;
      },
      deep: true,
    },
  },
};
</script>