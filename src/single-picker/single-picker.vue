<template>
    <cell-box :title="title">
        <popup-picker ref="popuppicker" slot="content" :columns="1"
                       :placeholder="placeholder"
                       :z-index="zIndex"
                       :call-data-list="callDataList"
                       :on-close="popupPickerClose"
        >
        </popup-picker>
    </cell-box>
</template>
<script>
  import cellBox from '../cell-box/cell-box.vue'
  import popupPicker from '../../components/popup-picker/popup-picker';
  // import popupPicker from '../../dist/index';

  export default{
    props:{
      title:String,
      placeholder:String,
      dataList:Array,
      zIndex:Number,
      initValue:{
        default () {
          return undefined;
        }
      },
      onClose:Function
    },
    mounted (){
      if(this.initValue){
        this.$refs.popuppicker.setValue(0,this.initValue);
      }
    },
    watch:{
      dataList (newList) {
        this.$refs.popuppicker.setList(0,newList);
      }
    },
    methods:{
      callDataList (col,parentVal,cb) {
        cb(this.dataList);
      },
      popupPickerClose (re) {
        this.onClose(re);
      }
    },
    components:{
      cellBox,
      popupPicker
    }
  }
</script>
