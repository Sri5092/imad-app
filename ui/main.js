

//submit username/password
var submit = document.getElementById('submit_btn');
submit.onclick = function () {
// var nameinput = document.getElementById('name');
// var name = nameinput.value;

    var request = new XMLHttpRequest();
    request.onreadystatechange = function(){
       if(request.readyState === XMLHttpRequest.DONE){
           if (request.status === 200){
               console.log('user logged in');
               alert("logged in successfully");
            }else if(request.status === 403){
                alert('username/password incorrect');
            } else if(request.status === 500){
                alert('Something wrong');
            }
       }
   };    
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    request.open('POST','http://sriekanth91.imad.hasura-app.io/login' + name,true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username,password: password}));
    
    
};