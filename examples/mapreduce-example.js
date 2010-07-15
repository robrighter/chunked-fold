var MapReduce = require('../chunked-fold').ChunkedMapReduce;
var inspect = require('sys').inspect;

//create a ChunkedMapReduce object and pass it 3 params:
//(1) The Map Function, which returns an array of explicit key value items that go into the reduce queue
//(2) The Reduce Function, which takes a iteration value and the accumulator and returns the new accumulated value
//(3) The initial value for the accumulator 
var test = new MapReduce(function(data){
  return [{key : 'one', value : data['count'] },{key : 'two', value : (data['count']*2) }];
}, function(value, acc){
  return value + acc;
}, 0);


//Add a listener to be notified when the accumulation changes for any key value
test.addListener('data', function(data){
  console.log(inspect(data));
  
  //in addition to getting notifications when a key changes, you can also get the current accumulation for 
  //every key at any time by using getAccumulationForAllKeys
  console.log(inspect(test.getAccumulationForAllKeys()));
});


//Push items (chuncks) into the queue to be processed through the MapReduce
for(var i=0; i<20; i++){
  test.push({ 'count' : 1});
}