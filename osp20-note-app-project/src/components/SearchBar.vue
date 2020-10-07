<template>
  <div class="search-container">
    <input
      type="text"
      v-model="searchText"
      name="search"
      placeholder="Search..."
      class="search-input"
    />
    <a href="#" class="search-btn">
      <i class="fas fa-search"></i>
    </a>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchText: "",
    };
  },
};
</script>