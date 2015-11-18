var redis = require('redis'),
	RDS_PORT = 6379,
	RDS_HOST = '121.42.161.32',
	RDS_OPTS = {},
	client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);

client.on('ready', function (res) {
	console.log('redis is ready');
});


/*
client.set(key,value,[callback])：设置单个key和value，回调函数可选

client.get(key,[callback])：得到key得到value，回调函数可选

connect：Redis的Connection事件之一，在不设置client.options.no_ready_check的情况下，客户端触发connect同时它会发出ready，如果设置了client.options.no_ready_check，当这个stream被连接时会触发connect，

redis.print：简便的回调函数，测试时显示返回值（从示例的输出结果中可以看出）
*/
client.on('connect', function () {
	client.set('author', 'snail', redis.print);
	client.get('author', redis.print);
	console.log('get');


	/*
	  client.hmset(hash, obj, [callback])：赋值操作，第一个参数是hash名称；第二个参数是object对象，其中key1:value1。。,keyn:valuen形式；第三个参数是可选回调函数
	
	  client.hmset(hash, key1, val1, ... keyn, valn, [callback])：与上面做用一致，第2个参数到可选回调函数之前的参数都是key1, val1, ... keyn, valn形式；
	
	  client.hgetall(hash, [callback])：获取值操作，返回一个对象
	*/
	client.hmset('short', { 'js': 'javascript', 'C#': 'C Sharp' }, redis.print);
    client.hmset('short', 'SQL', 'Structured Query Language', 'HTML', 'HyperText Mark-up Language', redis.print);

    client.hgetall("short", function (err, res) {
        if (err) {
            console.log('Error:' + err);
            return;
        }
        console.dir(res);
    });
	
	/*
	
   client.multi([commands])：这个标记一个事务的开始，由Multi.exec原子性的执行；github上描述是可以理解为打包，把要执行的命令存放在队列中，redis服务器会原子性的执行所有命令，node_redis接口返回一个Multi对象

　　Multi.exec( callback )：执行事务内所有命令；github上描述是client.multi()返回一个Multi对象，它包含了所有命令，直到Multi.exec()被调用；

　　Multi.exec( callback )回调函数参数err：返回null或者Array，出错则返回对应命令序列链中发生错误的错误信息，这个数组中最后一个元素是源自exec本身的一个EXECABORT类型的错误

　　Multi.exec( callback )回调函数参数results：返回null或者Array，返回命令链中每个命令的返回信息

　　end：redis已建立的连接被关闭时触发

　　client.sadd(key,value1,...valuen,[callback])：集合操作，向集合key中添加N个元素，已存在元素的将忽略；redis2.4版本前只能添加一个值

　　sismember(key,value,[callback])：元素value是否存在于集合key中，存在返回1，不存在返回0

　　smembers(key,[callback])：返回集合 key 中的所有成员，不存在的集合key也不会报错，而是当作空集返回

　　client.quit()：与之对应的还有一个client.end()方法，相对比较暴力；client.quit方法会接收到所有响应后发送quit命令，而client.end则是直接关闭；都是触发end事件
	
	*/
	var key = 'skills';
	client.sadd(key, 'C#', 'java', redis.print);
	client.sadd(key, 'nodejs');
	client.sadd(key, "MySQL");

	client.multi()
		.sismember(key, 'C#')
		.smembers(key)
		.exec(function (err, replies) {
            console.log("MULTI got " + replies.length + " replies");
            replies.forEach(function (reply, index) {
                console.log("Reply " + index + ": " + reply.toString());
            });
            client.quit();
		});
});