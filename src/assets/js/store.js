import {createStore} from 'vuex'

const store = createStore({
  state: {
    controls: null
  },
  mutations:{
    setControls({state}, controls){
      state.controls = controls
    }
  }
});

export default store;

// implement this store