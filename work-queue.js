(function(){
  exports.workQueue = function (thetask, initacc){
    var jobs = {},
        workid = 1,
        task = thetask
        working = false,
        acc = initacc;
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
      working = false
    };
    var _dotask = function(jobkey){
      var value = jobs[jobkey];
      acc = task(value, acc);
      delete jobs[jobkey];
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
var test = new exports.workQueue(function(item,acc){
  acc[''+item.count] = 'At item ' + item.count;
  console.log(require('sys').inspect(acc));
  if(item.count < 20){
     setTimeout(function(){test.push({ 'count' : (item.count+1)});}, 1000); 
  }
  return acc;
}, {});

test.push({ 'count' : 1});
*/