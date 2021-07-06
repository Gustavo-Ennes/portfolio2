<template>
   <div class='rounded-circle fly-controls-wrapper'>
      <div class='fly-controls'>
        <div class='row text-center'>
          <div class='col-4'></div>
          <div class='col-4'>
            <i id='up' class='fas fa-chevron-up arrow arrowUp'></i>
          </div>
          <div class='col-4'></div>
          <div class='col-4'> 
            <i id='left' class='fas fa-chevron-left arrow arrowLeft'></i>
          </div>
          <div class='col-4'><i class='center'></i></div>
          <div class='col-4'>
            <i id='right' class='fas fa-chevron-right arrow arrowRight'></i>
          </div>
          <div class='col-4'></div>
          <div class='col-4'>
            <i id='down' class='fas fa-chevron-down arrow arrowDown'></i></div>
          <div class='col-4'></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FlyControls',
  methods:{
    handleArrowClick(dir){
      switch(dir){
        case 'left':
          this.$emit("flyControlsLeft")
          break;
        case 'right':
          this.$emit("flyControlsRight")
          break;
        case 'up':
          this.$emit("flyControlsUp")
          break;
        case 'down':
          this.$emit("flyControlsDown")
          break;
        default:break;
      }
    }
  }

}
</script>

<style scoped>

.arrowUp, .arrowDown{
    padding:25px;
}
.fly-controls-wrapper{
    margin:10px;
    background-color:rgba(0, 0, 0, 0.1);
    box-shadow:1px 2px 5px 2px rgba(0, 0, 0, 0.4);
    z-index:3;
}

.arrow{
    color:rgba(0, 0, 0, 0.4);
}
.arrow:hover{
    cursor:pointer;
    color:rgba(0, 0, 0, 0.6);
}

i{
    font-size:40px;
}
</style>