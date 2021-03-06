var crypto = require('crypto');
var ws = require('ws');
var server = new ws.Server({
    host: '127.0.0.1',
    port: 5000
});

var socks ={};
var userlist = ''; 
//tests whether key matches respective sockid val in obj val as well as sockid val in closure

var checkSock = function(sockid){
  var keyvalpairs = Object.entries(socks);
  var idcheck;
  //would this be good to move into on.connection closure as it gives us the actual key?
  //or does sockid take care of that for us?
  for (var j in keyvalpairs) {
    if (keyvalpairs[j][0] === sockid){
      idcheck =keyvalpairs[j][1]['sockid'];
      console.log('sockval object had a key of: '+ keyvalpairs[j][0]+', a sockid value of: '+idcheck+' and socket has var sockid of: ' + sockid+' in it\'s closure');
    }
  }
};

server.on('connection',function(socket){
  //sockkey and sockval will be in particular 'sockets' closure---what does this do for me?
  //names ok?
  var sockid = crypto.randomBytes(7).toString('hex');
  var sockval = {};
  socks[sockid] = sockval;
  sockval.socket = socket;
  sockval.sockid = sockid;
  sockval.handle = sockid;
  console.log('==========someone connected==========');
  for (var users in socks){
    checkSock(users);
  }
  socket.on('message', function(mess){
    //NEEDS SANITIZATION!!!!
    console.log(sockval.handle+": "+mess.toString().trim());
    if(sockval.sockid === sockval.handle){
      sockval.handle = mess.toString().trim();
      console.log('Changing '+sockval.sockid+' to: '+sockval.handle);
      socket.send(sockval.sockid);
      for (var client in socks){
        if(socks[client].handle !== socks[client].sockid){
        userlist += socks[client].handle.trim()+' ';
        }
      }
      for (var client in socks){
        if(socks[client].handle !== socks[client].sockid){
          socks[client].socket.send(socks[client].sockid+": updateuserlist "+userlist);
        }
      }
      userlist = '';
    }else{
      for(var client in socks){
        if(socks[client].handle !== sockval.handle && socks[client].handle !== socks[client].sockid){
          socks[client].socket.send(sockval.handle+": "+mess);
        }
      }
    }
  });
});


