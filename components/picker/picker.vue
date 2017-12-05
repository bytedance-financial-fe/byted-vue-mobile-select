<template>
    <div class="e-w-picker" :id="elId">

                <div  class="w-container">
                    <div class="w-scroller-mask"></div>
                    <div class="w-scroller-indicator"></div>
                    <div class="w-content" v-html="contentHtml">
                    </div>
                </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import './Animate'
    import renderFun from './renderFun'
    import Scroller from './Scroller'
    import array2Json from './array2Json'
    export default {
      data(){
        return {
          elId:'e-w-picker-'+this._uid,
          _container:null,
          _content:null,
          _render:null,
          _scroller:null,

          dataJson:null,
          events:{},
          updateTimer:null,
          lastValue:null,
          h:30,
          contentHtml:'',
          pickerValue: null
        }
      },
      props:{
        dataList:{
          type: Array,
          default () {
            return [{name:null,value:null}]
          }
        },
        pickerValuep:{
          default () {
            return null
          }
        },
        show:{
          type:Boolean,
          default () {
            return true
          }
        },
        onChange:Function,
        aa:Number
      },
      created(){
        console.log(this.aa);
        this.pickerValue = this.pickerValuep;
        this.dataJson = array2Json(this.dataList);
        this.makeElement();
        this.$nextTick(()=>{
          this.initScroller();
        })
      },
      watch:{
        dataList: {
          deep: true,
          handler (val, oldVal) {
            this.dataJson = array2Json(this.dataList);
            this.makeElement();
            if(this.updateTimer){
              clearTimeout(this.updateTimer);
              this.updateTimer=null;
            }
            this.updateTimer = setTimeout(()=>{

//              if(!this.show){
//                return;
//              }
              this.$nextTick(()=>{
                this.updateScroller();
              })
            },0);
          }
        },
//        dataList(){
//          this.dataJson = array2Json(this.dataList);
//          if(this.updateTimer){
//            clearTimeout(this.updateTimer);
//            this.updateTimer=null;
//          }
//          this.updateTimer = setTimeout(()=>{
//            this.makeElement();
//            this.$nextTick(()=>{
//              this.updateScroller();
//            })
//          },10);
//        },
        pickerValue (newVal) {
          if(this.lastValue == newVal){
            return ;
          }
          if(this.show){
            this.setValue(newVal);
          }else if(this.dataJson[newVal]) {
            setTimeout(()=>{
              //this.pickerValue = newVal;
              this.onChange(this.dataJson[newVal].value,this.dataJson[newVal].name, newVal);
            },10);
          }
        },
        show (newVal){
          if(newVal){
            setTimeout(()=>{
              this.updateScroller();
            },550)
          }
        }
      },
      beforeDestroy () {
        this.removeEventHandler();
      },
      methods:{
        makeElement (){
          var list = '';
          this.dataList.forEach((item, ind) => {
            list += `<div class="w-cell" id="w-cell-${this._uid}-${item.value}" data-val="${item.value}">
            ${item.name}
            </div>`
          })
          this.contentHtml = '<div class="w-cell-withe"></div>'+list+'<div class="w-cell-withe"></div>'
        },
        initScroller (){
          this._container = document.querySelector("#"+this.elId+" .w-container");
          this._content = document.querySelector("#"+this.elId+" .w-content");

          // Initialize Scroller
          this._render = renderFun(window,this._content);
          var emitScrollPos = (sx, sy) => {
            if(sy<0){sy=0;}
            if(sy>(this._content.offsetHeight-this._container.clientHeight)){
              sy = this._content.offsetHeight-this._container.clientHeight;
            }
            var cnt = Math.floor(sy/this.h);
            var remainder = sy%this.h;
            if(remainder > this.h/2){
              cnt++;
            }
            if(this.onChange){
              var selEL = this._content.children[cnt+1];
              var value = selEL.getAttribute("data-val");


              if(this.dataJson[value]){
                value = this.dataJson[value].value;
              }else {
                return;
              }
              this.lastValue = value;
              this.pickerValue = value;
              setTimeout(() => {
                this.onChange(this.dataJson[value].value, this.dataJson[value].name, value);
              }, 0);

            }
          };
          this._scroller = new Scroller(this._render, {
            snapping: true,
            scrollingX: false,
            emitScrollPos: emitScrollPos
          });
          this.updateScroller();

          this.addEventHandler();
        },
        updateScroller () {

          var container = this._container;
          var content = this._content;
          var scroller = this._scroller;

          // Setup Scroller
          var rect = container.getBoundingClientRect();
          scroller.setPosition(rect.left+container.clientLeft, rect.top+container.clientTop);
          scroller.setDimensions(container.clientWidth, container.clientHeight, content.offsetWidth, content.offsetHeight);
          scroller.setSnapSize(container.clientWidth, this.h);

          this.setValue(this.pickerValue);
        },
        addEventHandler (){
          // Event Handler
          var container = this._container;
          var content = this._content;
          var scroller = this._scroller;
          if ('ontouchstart' in window) {
            this.events["touchstart"] = function(e) {
              // Don't react if initial down happens on a form element
              if (e.target.tagName.match(/input|textarea|select/i)) {
                return;
              }
              scroller.doTouchStart(e.touches, e.timeStamp);
              e.preventDefault();
            };
            this.events["touchmove"] = function(e) {
              scroller.doTouchMove(e.touches, e.timeStamp);
            };
            this.events["touchend"] = function(e) {
              scroller.doTouchEnd(e.timeStamp);
            };
            container.addEventListener("touchstart", this.events["touchstart"], false);
            document.addEventListener("touchmove", this.events["touchmove"], false);
            document.addEventListener("touchend", this.events["touchend"], false);
          } else {
            var mousedown = false;

            this.events["mousedown"] = function(e) {
              // Don't react if initial down happens on a form element
              if (e.target.tagName.match(/input|textarea|select/i)) {
                return;
              }
              scroller.doTouchStart([{
                pageX: e.pageX,
                pageY: e.pageY
              }], e.timeStamp);
              mousedown = true;
            };
            this.events["mousemove"] = function(e) {
              if (!mousedown) {
                return;
              }
              scroller.doTouchMove([{
                pageX: e.pageX,
                pageY: e.pageY
              }], e.timeStamp);
              mousedown = true;
            };
            this.events["mouseup"] = function(e) {
              if (!mousedown) {
                return;
              }
              scroller.doTouchEnd(e.timeStamp);
              mousedown = false;
            };
            container.addEventListener("mousedown", this.events["mousedown"], false);
            document.addEventListener("mousemove", this.events["mousemove"], false);
            document.addEventListener("mouseup", this.events["mouseup"], false);
          }
        },
        removeEventHandler (){
          var container = this._container;
          if ('ontouchstart' in window) {
            container.addEventListener("touchstart", this.events["touchstart"], false);
            document.addEventListener("touchmove", this.events["touchmove"], false);
            document.addEventListener("touchend", this.events["touchend"], false);
          } else {
            container.addEventListener("mousedown", this.events["mousedown"], false);
            document.addEventListener("mousemove", this.events["mousemove"], false);
            document.addEventListener("mouseup", this.events["mouseup"], false);
          }

        },
        setValue (val){
            //.style.webkitTransform.match(/translate3d\((.+x)\)/)
          var id = `w-cell-${this._uid}-${val}`;
          var cell = document.getElementById(id);
          if(!cell){return;}
          this._scroller.scrollTo(0,cell.offsetTop-(2*this.h));
        }
      }
    }
</script>

<style lang="less">
    @import "picker.less";
</style>