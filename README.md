ChunkedFold is a simple object for folding/reducing a list that is constantly being appended. It is particularly useful for processing feeds. It has 2 objects:

(1) ChunkedFold
---------------

Create a ChunkedFold object and pass it 2 params:

(1) The Fold/Reduce Function, which takes an iteration value and the accumulator and returns the new accumulated value

(2) The initial value for the accumulator

	var example = new ChunkedFold(function(item,acc){
	  acc[''+item.count] = 'At item ' + item.count;
	  if(item.count < 20){
	     setTimeout(function(){example.push({ 'count' : (item.count+1)});}, 1000); 
	  }
	  return acc;
	}, {});


Add a listener to be notified when the accumulation changes

	example.addListener('data', function(data){
	  console.log(inspect(data));
	});


Push items (chuncks) into the queue to be processed

	example.push({ 'count' : 1});


in addition to getting notifications the accumulator changes, you can also get the current accumulation for 
at any time by using getAccumulator

	console.log("The Accumulator is currently: " + inspect(example.getAccumulator()));


(2) ChunkedMapReduce
--------------------

Create a ChunkedMapReduce object and pass it 3 params:

(1) The Map Function, which returns an array of explicit key value items that go into the reduce queue

(2) The Reduce Function, which takes a iteration value and the accumulator and returns the new accumulated value

(3) The initial value for the accumulator

	 
	var test = new MapReduce(function(data){
	  return [{key : 'one', value : data['count'] },{key : 'two', value : (data['count']*2) }];
	}, function(value, acc){
	  return value + acc;
	}, 0);


Add a listener to be notified when the accumulation changes for any key value

	test.addListener('data', function(data){
	  console.log(inspect(data));
  
	  //in addition to getting notifications when a key changes, you can also get the current accumulation for 
	  //every key at any time by using getAccumulationForAllKeys
	  console.log(inspect(test.getAccumulationForAllKeys()));
	});


Push items (chunks) into the queue to be processed through the MapReduce

	for(var i=0; i<20; i++){
	  test.push({ 'count' : 1});
	}
