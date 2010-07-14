
var MapReduce = exports.MapReduce = function(themap, thereduce, reduceinit) {
  var WorkerQueue = require('./work-queue').WorkQueue,
      _reductionHash = {};
  
  var _mapQueue = new WorkQueue(function (item){
    var mapresult = themap(item);
    mapresult =  ((mapresult instanceof Array) ? mapresult : [mapresult]);
    mapresult.forEach(function(item){
      if( ((typeof item) ==  'object') && item.hasOwnProperty('key') && item.hasOwnProperty('value')){
        if(!reductionHash.hasOwnProperty(item['key'])){
          _reductionHash[item.key] = new WorkQueue(thereduce,reduceinit);
        }
        _reductionHash[item.key].push(item['value']);
      }else{
        //do nothing, we drop poorly formated results on the floor
      }
    });
    
  });
  
  this.push = function(topush){
    _mapQueue.push(topush);
  }
  
}