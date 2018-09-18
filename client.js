var socket = new WebSocket('ws://127.0.0.1:5000');
var chatinput = document.createElement('input');
chatinput.type = 'text';
document.body.appendChild(chatinput);
var username;

socket.addEventListener('open', function(){
  console.log('I\'m connected');
  var button = document.createElement('button');
  document.body.appendChild(button);
  button.innerText = 'Login';
  //should event listener be in here?
  button.addEventListener('click', function(){
    //CONDITIONAL BELOW COPYPASTED FROM GITHUB
    //Havent actually limited to 15 chars
    if(username === undefined && !(chatinput.value.match(/^[0-9a-z]+$/))){
      alert('Invalid user name. Please only use alpha numeric characters. Usernames may be up to 15 characters long.');
    }else if(username === undefined) {
      socket.send(chatinput.value.toString().trim()+'\n');
      button.innerText = 'Send';
      username = chatinput.value.toString().trim();
    }else{
      socket.send(chatinput.value.toString().trim()+'\n');
    }
    chatinput.value = '';
  });
});

socket.addEventListener('message', function(mess){
  console.log(mess.data);
});
//How should client get its username? Send to server then use what it replies with? Does this help confirm theyre using same thing?----------------for now ill have it set itself
//chatinput.addEventListener('keypress',function(keypress){


