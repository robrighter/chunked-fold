var MapReduce = require('./node-mapreduce').MapReduce;
 
var test = new MapReduce(function(data){
  return [{key : 'one', value : data['count'] },{key : 'two', value : (data['count']*2) }];
}, function(value, acc){
  return value + acc;
}, 0);

test.addListener('data', function(data){
  console.log(require('sys').inspect(data));
});

for(var i=0; i<20; i++){
  test.push({ 'count' : 1});
}