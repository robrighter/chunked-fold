var ChunkedFold = require('../chunked-fold').ChunkedFold;
var inspect = require('sys').inspect;


//Create a ChunkedFold object and pass it 2 params:
//(1) The Fold/Reduce Function, which takes an iteration value and the accumulator and returns the new accumulated value
//(2) The initial value for the accumulator
var example = new ChunkedFold(function(item,acc){
  acc[''+item.count] = 'At item ' + item.count;
  if(item.count < 20){
     setTimeout(function(){example.push({ 'count' : (item.count+1)});}, 1000); 
  }
  return acc;
}, {});

//Add a listener to be notified when the accumulation changes
example.addListener('data', function(data){
  console.log(inspect(data));
});


//Push items (chuncks) into the queue to be processed
example.push({ 'count' : 1});


//in addition to getting notifications the accumulator changes, you can also get the current accumulation for 
//at any time by using getAccumulator
console.log("The Accumulator is currently: " + inspect(example.getAccumulator()));
