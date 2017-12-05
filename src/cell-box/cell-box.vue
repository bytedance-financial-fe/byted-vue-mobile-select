<template>
    <div class="flex-box cell-box f-pr">
        <div class="addon l">
            {{title}}
            <slot name="addon-l"></slot>
        </div>
        <div class="content flex1">
            <slot name="content"></slot>
        </div>
        <div class="addon r">
            <slot name="addon-r"></slot>
        </div>
    </div>
</template>
<script>
    export default {
      props:{
        title:{
          type:String,
          default () {
            return 'Title'
          }
        }
      }
    }

</script>
<style scoped lang="less">
    @import "cell-box.less";
    .f-pr {
      position: relative;
    }
</style>