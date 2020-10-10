<template>
  <div>
    <v-dialog v-model="category_dialog" max-width="800" color="white">
      <v-card solo="solo">
        <div class="ma-5">
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
        <div class="ma-8">
          <v-row>
            <v-col cols="12" md="6">
              <span
                ><input
                  class="category-input"
                  type="text"
                  size="70%"
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
    </v-dialog>
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
    },

    createCategory() {
      this.category = this.$store.state.category;
      this.category.push({ title: this.name });
      console.log(this.category);
      localStorage.setItem("category", JSON.stringify(this.category));
      this.$store.state.category = JSON.parse(localStorage.getItem("category"));
      this.name = "";
    },

    deleteCategory() {},
  },

  mounted() {
    if (localStorage.getItem("category")) {
      this.$store.state.category = JSON.parse(localStorage.getItem("category"));
      this.category = this.$store.state.category;
    }
  },
};
</script>