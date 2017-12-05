import Vue from 'vue';
import singlePicker from '../single-picker/single-picker';

/* eslint-disable no-new */
window._app = new Vue({
  el: '#app',
  data() {
    return {
      initVal: 'mm',
      list: [
        {
          name: '爸爸',
          value: 'bb'
        },
        {
          name: '妈妈',
          value: 'mm'
        },
        {
          name: '爷爷',
          value: 'yy'
        },
        {
          name: '奶奶',
          value: 'nn'
        },
        {
          name: '姐姐',
          value: 'jj'
        }
      ],
    }
  },
  components: {
    singlePicker
  },
  methods: {
    selectClose(re) {
      console.log(JSON.stringify(re, null, 2));
    }
  },
  template: `<div>
    <h2>select example</h2>
    <single-picker class="custom-select-item" title="亲戚"
    placeholder="直系亲属"
    :data-list="list"
    :on-close="selectClose" :initValue="null">
    </single-picker>
  </div>`
});
