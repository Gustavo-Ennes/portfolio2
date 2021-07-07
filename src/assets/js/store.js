import {createStore} from 'vuex'
import AnimationClass from '../js/index.js'

const store = createStore({
  state: {
    controls: null,
    animation:null
  },
  mutations:{
    setControls(state, controls){
      state.controls = controls
    },
    setAnimation(state, animation){
      state.animation = animation
    }
  },
  actions:{
    async initAnimation({state, commit}){
      commit('setAnimation', new AnimationClass())
      await state.animation.init()
      commit('setControls', state.animation.controls)
      state.animation.animate()
    }
  }
});

export default store;

// implement this store