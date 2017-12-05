<template>
    <div class="e-w-popup-picker">
        <span class="w-picker-show"  @click="fadeIn">
            <span v-show="placeholderShow"  class="w-placeholder" ref="wPlaceholder">{{placeholder}}</span>
            <span v-show="!placeholderShow" class="selected-item" ref="selectedItem">
                <span v-for="(item, index) in pickers" :key="index">{{(index != 0)?'-':''}}{{item.pickName}}</span>
            </span>
        </span>
    <popup :z-index="zIndex" :height="popHeight" :show-flag="popupShow" :on-close="popupClose">
        <div class="w-btns e-w-flexbox">
            <a class="w-l-btn e-w-flexbox-item" @click="cancel">
                取消
            </a>
            <a class="w-r-btn e-w-flexbox-item" @click="confirm">
                完成
            </a>
        </div>
        <div class="e-w-flexbox">

            <div v-for="(item, index) in pickers" :key="index" class="e-w-flexbox-item">
                <picker :data-list="item.dataList" :picker-valuep="item.val" :on-change="item.onChange" :show="popupShow" :aa="columnsMax">

                </picker>
            </div>

        </div>
    </popup>
    </div>
</template>
<script type="text/ecmascript-6">
    import popup from '../popup/popup.vue'
    import picker from '../picker/picker.vue'
    export default {
      data () {
        return {
          popupShow:false,
          placeholderShow:true,
          columnsMax:3,
          pickerValuesCeche:[],
          pickerValues:[],
          pickers:[],
          setValueCallBack:null,
          doSetValueCallBackTimer:null,
        }
      },
      props:{
        placeholder:String,
        columns:{
          required:true,
          type:Number,
          default () {
            return 1
          }
        },
        callDataList:{
          type:Function,
          required:true
        },
        zIndex:Number,
        popHeight:{
          type:Number,
          default () {
            return 188;
          }
        },
        onClose:Function
      },
//      computed:{
//        pickerValuesStr (){
//          return JSON.stringify(this.pickerValues,null,2)
//        }
//      },
      created () {
        // this.pickerValuesCeche = Array.concat([],this.pickerValues)
        this.makePickers();
      },
      methods:{
        makePickers () {
          var self = this;
          var columns;
          if(self.columns<1){
            columns = 1
          }else if(self.columns>self.columnsMax){
            columns = self.columnsMax;
          }else {
            columns = self.columns;
          }
          for (var i = 0; i < columns; i++){
            //var istr = 'i'+i;
            if(!self.pickers[i]){
              self.pickers.push({
                val:self.pickerValues[i],
                dataList:[],
                onChange:null,
                pickName:''
              });
            }
            //this.pickers[i].val = this.pickerValues[i];
            self.pickers[i].onChange = ((ind) => (val,name,newVal) =>{

              var istr1 = 'i'+ind;
              var istr2 = 'i'+(ind+1);
              self.doSetValueCallBack();
              //self.pickerValues.$set(ind,val);
              self.pickerValues[ind] = val;
              //this.pickers[ind].pickName = name;
              self.pickers[ind].pickName = name;
              self.pickers[ind].val = newVal;
              if((ind+1) < columns){
                self.callDataList(ind + 1, val, (dl) => {
                  var len = self.pickers[ind+1].dataList.length;
                  self.pickers[ind+1].dataList.splice(0,len, ...dl);
                });
              }
            })(i);
          }

          self.callDataList(0,null,(dl) => {
            var len = self.pickers[0].dataList.length;
              self.pickers[0].dataList.splice(0,len, ...dl);
              console.log(self.pickers[0].dataList)
            });


        },
        fadeIn () {
          this.popupShow = true;
//          setTimeout(()=>{
//            this.$broadcast('updateScroller');
//          },550);
        },
        confirm () {
          this.popupShow=false;
          var re = [];
          this.pickers.forEach((item) => {
            re.push({
              value: item.val,
              name: item.pickName
            })
          });
          this.pickerValuesCeche = [].concat(this.pickerValues);
          this.placeholderShow = false;
          this.$refs.wPlaceholder.style.display = 'none';
          this.$refs.selectedItem.style.display = 'block';
          this.onClose({type: 'confirm',data: re});
        },
        cancel (){
          this.pickerValuesCeche.forEach((val,index) => {
            this.pickers[index].val = val;
          });
          this.popupShow=false;
          this.onClose({type:'cancel'});
        },
        popupClose () {
          this.pickerValuesCeche.forEach((val,index) => {
            //this.$set(`pickers.${'i'+index}.val` ,val);
            this.pickers[index].val = val;
          });
          this.popupShow = false;
          this.onClose({type:'cancel'});
        },
        setValue (col, val) {
          //this.$set(`pickers.${'i'+col}.val` ,val);
          this.pickers[col].val = val;

          this.pickerValuesCeche[col] = val;

          this.placeholderShow = false;
          this.$refs.wPlaceholder.style.display = 'none';
          this.$refs.selectedItem.style.display = 'block';
          return {
            then: (cb) => {
              this.setValueCallBack = cb;
            }
          }
        },
        setList (col,list) {
          //this.$set(`pickers.${'i' + col}.dataList`, list);
          var len = this.pickers[col].dataList.length;
          this.pickers[col].dataList.splice(0,len, ...list);
          return {
            then: (cb) => {
              this.setValueCallBack = cb;
            }
          }
        },
        doSetValueCallBack (){
          if(!this.setValueCallBack){return;}
          if(this.doSetValueCallBackTimer){
            clearTimeout(this.doSetValueCallBackTimer);
            this.doSetValueCallBackTimer = null;
          }
          this.doSetValueCallBackTimer = setTimeout(()=>{
            this.setValueCallBack();
            this.setValueCallBack = null;
          },50);
        }
      },
      components:{
        popup,
        picker
      }

    }
</script>
<style lang="less">
    @import "popup-picker.less";
</style>