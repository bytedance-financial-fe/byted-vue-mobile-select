/**
 * Created by weijianli on 16/12/24.
 */
function array2Map(array) {
  var re = {};
  array.forEach((item)=>{
    re[item.value] = item;
  });
  return re;
}
export default array2Map