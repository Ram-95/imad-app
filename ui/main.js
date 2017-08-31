//console.log('Loaded!');
//alert('Hi! Welcome to IMAD.');

/*var button = document.getElementById('counter');
button.onclick = function() {
// Create a request object
    var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function()
    {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if(request.status === 200) {
              var counter = request.responseText;
              var span = document.getElementById('count');
              span.innerHTML = counter.toString();
          }
      }  
    };
    
    //Make the request
    request.open('GET', 'http://ramkottapally.imad.hasura-app.io/counter', true);
    request.send(null);
};*/


//Submit names and the appear in the list

var submit = document.getElementById('submit-btn');
submit.onclick = function() {
  // Make a request to the server
  
  var request = new XMLHttpRequest();
    
    //Capture the response and store it in a variable
    request.onreadystatechange = function()
    {
      if(request.readyState === XMLHttpRequest.DONE) {
          //Take some action
          if(request.status === 200) {
              
              alert('User Successfully Logged In');
          } else if(request.status === 403) {
              alert('Forbidden');
          } else if(request.status === 500) {
              
              alert('Some problem with the Server');
          }
              /* This part is to insert the contents into the list
              var names = request.responseText;
              names = JSON.parse(names);
              var list = '';
              
              for(var i = 0; i < names.length; i++)
              {
                list += '<li>' + names[i] + '</li>';
            }
            
            var ul = document.getElementById('namelist');
            ul.innerHTML = list;*/
          }
      }  
    };
    
    //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log(username);
    console.log(password);
    
    request.open('POST', 'http://ramkottapally.imad.hasura-app.io/login', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({username: username, password: password}));
    
    
 
  
  
    
};