var socket = new WebSocket('ws://127.0.0.1:5000');
var chatinput = document.getElementById('chatinput');
var chatbox = document.getElementById('chatbox');
var username;
var chatoutput = document.getElementById('chatoutput');
//chatoutput = chatoutput.getElementsByTagName('ul');
var buttonbox = document.getElementById('buttonbox');
var button = document.createElement('button');
var userlist = document.getElementById('userlist');
//userlist = userlist.getElementsByTagName('ul');
buttonbox.appendChild(button);
button.innerText = 'Login';
var serverid = false;
var currentusers = [];
socket.addEventListener('open', function(){
  var send = function(){
    //CONDITIONAL BELOW COPYPASTED FROM GITHUB
    if(username === undefined && (!(chatinput.value.match(/^[0-9a-z]+$/)) || chatinput.value.toString().length > 15 )){
      alert('Invalid user name. Please only use alpha numeric characters. Usernames may be up to 15 characters long.');
    }else if(username === undefined) {
      socket.send(chatinput.value.toString().trim()+'\n');
      button.innerText = 'Send';
      username = chatinput.value.toString().trim();
      var handlenotice = document.createElement('li');
      handlenotice.innerText = 'Your handle has changed to: '+username+'\n';
      chatoutput.appendChild(handlenotice);
    }else{
      outgoingmssg = document.createElement('li');
      outgoingmssg.innerText = username+': '+chatinput.value.toString().trim()+'\n';
      socket.send(chatinput.value.toString().trim()+'\n');
      //is this appending to the ul or underneath it
      chatoutput.appendChild(outgoingmssg);
    }
    chatinput.value = '';
  };
  console.log('I\'m connected');
  button.addEventListener('click', send);
  chatinput.addEventListener('keypress',function(e){
    if(e.keyCode === 13){
      send();
    }
  });
});
socket.addEventListener('message', function(mess){
  if (serverid === false) {
    serverid = mess.data;
    return;
  }
  if (mess.data.split(':')[0].trim() === serverid){
    if(mess.data.split(' ')[1].trim() === 'updateuserlist'){
      currentusers = mess.data.split('updateuserlist')[1].trim().split(' ');
      //better way to do this?
      while (userlist.hasChildNodes()){
        userlist.removeChild(userlist.firstChild);
      }
      for(var x in currentusers){
        var user2append = document.createElement('li');
        user2append.innerText = currentusers[x];
        userlist.appendChild(user2append);
      }
    }
    return;
  }
  var incomingmssg = document.createElement('li');
  incomingmssg.innerText = mess.data;
  chatoutput.appendChild(incomingmssg);
});
//How should client get its username? Send to server then use what it replies with? Does this help confirm theyre using same thing?----------------for now ill have it set itself


