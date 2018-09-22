// how does css address elements created by js script?
var socket = new WebSocket('ws://127.0.0.1:5000');
var chatinput = document.getElementById('chatinput');
var chatbox = document.getElementById('chatbox');
var username;
var chatoutput = document.getElementById('chatoutput');
var buttonbox = document.getElementById('buttonbox');
var button = document.createElement('button');
buttonbox.appendChild(button);
button.innerText = 'Login';

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
      chatoutput.appendChild(outgoingmssg);
    }
    chatinput.value = '';
  };
  console.log('I\'m connected');
  //should event listener be in here?
  button.addEventListener('click', send);
  chatinput.addEventListener('keypress',function(e){
    if(e.keyCode === 13){
      send();
    }
  });
});
socket.addEventListener('message', function(mess){
  var incomingmssg = document.createElement('li');
  incomingmssg.innerText = mess.data;
  chatoutput.appendChild(incomingmssg);
});
//How should client get its username? Send to server then use what it replies with? Does this help confirm theyre using same thing?----------------for now ill have it set itself
//chatinput.addEventListener('keypress',function(keypress){


