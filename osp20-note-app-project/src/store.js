import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    category: [
      {title:"기본메모"}, 
    ],
    notes:[],

  },
  mutations: {
    addNote(state,note){
      state.notes.push(note);
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },
    updateNote(state,data){
      state.notes[data.modifyIndexData]=data.note;
      localStorage.setItem("notes", JSON.stringify(state.notes));
    },



    // 카테고리가 변할때 마다 localStorage 에 변경해줄것
    addCategory(state, category) {
      
        if(localStorage.getItem('category')==="null"){
          state.category=[];
        }
        console.log(category);
        // 맨 뒤에 해당 카테고리를 추가한다.
        state.category.push(category);
        console.log(state.category);


        // 로컬 스토리지에 변경사항을 저장한다.
        localStorage.setItem("category", JSON.stringify(state.category));
   
        console.log(state.category);
    },
    deleteCategory(state, index) {
      // 이곳에서는 해당 카테고리에 해당되는 메모를 기본메모 카테고리로 이동하기
      state.category.splice(index, 1);

      if(state.category.length === 0){
        state.category = [{}];
        localStorage.setItem("category", JSON.stringify(state.category));
      }
      else{
        localStorage.setItem("category", JSON.stringify(state.category));
      }
    }
  },
})

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),

}).$mount('#app')