(function(){
  exports.MapReduce = function(themap, thereduce, reduceinit) {
    var WorkQueue = require('./work-queue').WorkQueue;
    var reductionHash = {};
    var events = require('events');
    var _eventEmitter = new events.EventEmitter();
    
    this.addListener = function(){ return (_eventEmitter.addListener).apply(_eventEmitter, arguments); };
    this.removeListener = function(){ return (_eventEmitter.removeListener).apply(_eventEmitter, arguments); };
    this.removeAllListeners  = function(){ return (_eventEmitter.removeAllListeners).apply(_eventEmitter, arguments); };  
    
    var mapQueue = new WorkQueue(function (item){
      var mapresult = themap(item);
      mapresult = ((mapresult instanceof Array) ? mapresult : [mapresult]);
      mapresult.forEach(function(item){
        if( ((typeof item) ==  'object') && item.hasOwnProperty('key') && item.hasOwnProperty('value')){
          if(!reductionHash.hasOwnProperty(item['key'])){
            reductionHash[item.key] = new WorkQueue(thereduce,reduceinit);
            reductionHash[item.key].addListener('data', function(data){
               _eventEmitter.emit('data', { 'key' : item.key, 'accumulation' : data });
            });
          }
          reductionHash[item.key].push(item['value']);
        }else{
          //do nothing, we drop poorly formated results on the floor
        }
      });
    });
    this.push = function(topush){
      mapQueue.push(topush);
    }
  }
})();