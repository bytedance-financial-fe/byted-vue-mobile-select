/**
 * Created by weijianli on 2017/5/22.
 */
var path = require('path')
var glob = require('glob')
//entries函数
function getEntries(jsDir) {
  //var jsDir = path.join(__dirname, '../src/entry');
  var entryFiles = glob.sync(jsDir + '/**/*.js');
  //console.log(entryFiles)
  var map = {};

  for (var i = 0; i < entryFiles.length; i++) {
    var filePath = entryFiles[i];
    var filename = filePath.replace(jsDir,'').replace(/\.js$/,'');
    map[filename] = filePath;
  }
  return map;
}
//console.log(getEntries());
module.exports = getEntries;