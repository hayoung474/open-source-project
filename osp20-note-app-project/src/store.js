import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    category: [
      {title:"기본메모"},
      {title:"살 것"},
      {title:"옷 정보"},
      
    ],
    notes:[],

  },
  mutations: {
    addNote(state,note){
      state.notes.push(note);
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },
    // 카테고리가 변할때 마다 localStorage 에 변경해줄것
    addCategory(state, categoryName) {

      // 중복 카테고리 이름은 불가능하도록
      if (state.category.includes(categoryName) === true) {
        alert("중복 카테고리 이름은 불가능 합니다");
      }
      else {
        // 맨 뒤에 해당 카테고리를 추가한다.
        state.category.push({"title":categoryName});
        // 로컬 스토리지에 변경사항을 저장한다.
        localStorage.setItem("category");
      }

    },
    updateCategory(state, beforeCategoryName, afterCategoryName) {

      var index = state.category.indexOf(beforeCategoryName);
      console.lof(index);
      state.category[index].title = afterCategoryName;
      localStorage.setItem("category");

    },
    deleteCategory(state, categoryName) {
      // 이곳에서는 해당 카테고리에 해당되는 메모를 기본메모 카테고리로 이동하기
      var index = state.category.indexOf({"title":categoryName});
      state.notes.splice(index, 1);
      localStorage.setItem("category");
    }
  },
})

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),

}).$mount('#app')