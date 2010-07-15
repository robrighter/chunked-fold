(function(){
  exports.WorkQueue = function (thetask, initacc){
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
})();


/*
var test = new exports.WorkQueue(function(item,acc){
  console.log('ACC is: ' + require('sys').inspect(acc));
  acc[''+item.count] = 'At item ' + item.count;
  if(item.count < 20){
     setTimeout(function(){test.push({ 'count' : (item.count+1)});}, 1000); 
  }
  return acc;
}, {});

test.addListener('data', function(data){
  console.log(require('sys').inspect(data));
});

test.push({ 'count' : 1});
*/