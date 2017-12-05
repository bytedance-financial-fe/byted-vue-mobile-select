<template>
    <div class="e-w-popup" :style="{zIndex:zIndex}">
        <a class="w-bg" v-show="showFlag" @click="selfClose"></a>
        <transition name="e_w_slideb" >
            <div class="w-box" v-show="showFlag"  :style="{height:height+'px'}">
                <slot>
                    slot
                </slot>
            </div>
        </transition>
    </div>
</template>
<script>
    export default {
//      data(){
//
//      },
      props: {
        zIndex:{
          type: Number,
          default () {
            return 100
          }
        },
        height:{
          type: Number,
          default () {
            return 250
          }
        },
        onClose:{
          type: Function,
          default () {
            return function () {

            }
          }
        },
        showFlag:{
          type:Boolean,
          default () {
            return false;
          }
        }

      },
      methods:{
        selfClose () {
          //this.showFlag = false;
          if(this.onClose){
            this.onClose()
          }
        }
      }
    }
</script>
<style lang="less">
    @import "popup.less";
</style>