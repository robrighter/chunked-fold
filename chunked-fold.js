(function(){
  
  exports.ChunkedFold = function (thetask, initacc){
    var jobs = {};
    var workid = 1;
    var task = thetask;
    var working = false;
    var events = require('events');
    var eventEmitter = new events.EventEmitter();
        
    this.addListener = function(){ return (eventEmitter.addListener).apply(eventEmitter, arguments); };
    this.removeListener = function(){ return (eventEmitter.removeListener).apply(eventEmitter, arguments); };
    this.removeAllListeners  = function(){ return (eventEmitter.removeAllListeners).apply(eventEmitter, arguments); };
     
    this.push = function(value){
      jobs[''+(workid++)] = value;
      _kickoff();
    };
    
    this.getAccumulator = function(){
      return initacc;
    };
    
    var _kickoff = function(){
      if(!working){
        setTimeout(_work, 1);
      }
    };
    var _work = function(){
      working = true
      while(_countkeys() > 0){
        for(var key in jobs){
          _dotask(key);
        }
      }
      working = false;
    };
    var _dotask = function(jobkey){
      var value = jobs[jobkey];
      initacc = task(value, initacc);
      delete jobs[jobkey];
      eventEmitter.emit('data', initacc);
    };
    var _countkeys = function() {
      var toreturn = 0;
      for(var key in jobs){
          toreturn++;
       }
       return toreturn;
    }
  
  }
  
  exports.ChunkedMapReduce = function(themap, thereduce, reduceinit) {
    var WorkQueue = exports.ChunkedFold;
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
    
    this.getAccumulationForAllKeys = function(){
      var toreturn = {};
      for(var key in reductionHash){
          toreturn[key] = reductionHash[key].getAccumulator();
       }
       return toreturn;
    }
    
    this.push = function(topush){
      mapQueue.push(topush);
    }
  }
  
})();