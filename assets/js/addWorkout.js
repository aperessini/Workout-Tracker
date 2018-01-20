
/*
Aaron Peressini
6/11/2017
CS 290
 */

document.addEventListener('DOMContentLoaded', bindButtons);

document.getElementById('tracker').style.border = 'medium solid teal';
document.getElementById('tracker').style.textAlign = 'center';
var c = document.getElementById('tablehead').children;
for(var x = 0; x < c.length; x++)
{
	c[x].style.borderBottom = 'thin solid teal';
    	c[x].style.borderRight = 'thin solid teal';
}

var count = 1;
var hostname = "https://whispering-ocean-26663.herokuapp.com:";
var port = document.getElementById('port').value;

function bindButtons(){
        document.getElementById('addWorkout').addEventListener('click', function(event){
          //var count = 1;
	  //console.log(count);
	  //count++; 
          var req = new XMLHttpRequest();
          var name = document.getElementById('name').value;
          if(name == "")
          {
              alert("Name is required. Please try again.");
              event.preventDefault();
              return;
          }
          var reps = document.getElementById('reps').value;
          var weight = document.getElementById('weight').value;
          var date = document.getElementById('date').value;
          if(document.getElementsByName('lbs')[0].checked){
             var lbs = 1;
          }
         
          else{
              var lbs = 0;
          }
    
          //req.setRequestHeader('Content-Type', 'text/plain');
          req.open('GET', hostname + port + "/insert?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs, true);
          req.addEventListener("load", function(event){
          if(req.status >= 200 && req.status < 400)
          {
              var response = JSON.parse(req.responseText);

              var newRow = document.createElement("tr");
              var newName = document.createElement("td");
              newName.textContent = response[response.length-1].name;
              newRow.appendChild(newName);
              var newReps = document.createElement("td");
              newReps.textContent = response[response.length-1].reps;
              newRow.appendChild(newReps);
              var newWeight = document.createElement("td");
              newWeight.textContent = response[response.length-1].weight;
              newRow.appendChild(newWeight);
              var newDate = document.createElement("td");
              newDate.textContent = response[response.length-1].date.substring(0,10);
              newRow.appendChild(newDate);
              var newLbs = document.createElement("td");
              if(response[response.length-1].lbs == 1){
                newLbs.textContent = "LB";
              }
              else if(response[response.length-1].lbs == 0){
                  newLbs.textContent = "KG";
              }
              
              newRow.appendChild(newLbs);
              

              var customizeForm = document.createElement("form");
              var newID = document.createElement("input");
              newID.textContent = response[response.length-1].id;
              newID.setAttribute("type", "hidden");
              customizeForm.appendChild(newID);     

              var deleteButton = document.createElement("input");
              deleteButton.id = 'deleteWorkout';
              deleteButton.tagName='deleteWorkout';
              deleteButton.value = 'Delete Workout';
              deleteButton.className = 'deleteButton';
              deleteButton.type = 'submit';
              deleteButton.addEventListener('click', callDeleteWorkout);
              customizeForm.appendChild(deleteButton);

              var editButton = document.createElement("input");
              editButton.id = 'editWorkout';
              editButton.value = 'Edit Workout';
              editButton.className = 'editButton';
              editButton.type = 'submit';
              editButton.addEventListener('click', callEditWorkout);
              customizeForm.appendChild(editButton);

              newRow.appendChild(customizeForm);
              newRow.id = response[response.length-1].id;
              newRow.style.border = 'thin solid teal';
              document.getElementById("tracker").appendChild(newRow);

          }
          else
          {
             console.log("Error in network request: " + req.statusText);
          }
              
                          
         });
	 //console.log("Yoooooooo");
         //event.preventDefault();  
         req.send(null); 
         event.preventDefault();          
        });
	
	//event.preventDefault();        

      
   /*         document.getElementById('editWorkout').addEventListener('click', function(event){
            
                var req = new XMLHttpRequest();

                req.open('GET', "http://flip1.engr.oregonstate.edu:5100/insert?name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs, true);
                req.addEventListener("load", function(){
                if(req.status >= 200 && req.status < 400)
                {

                }

                else
                {
                console.log("Error in network request: " + req.statusText);
                }

               // event.preventDefault();  
                req.send(null); 
            });

            event.preventDefault();
        });*/
    

    
}

 //document.getElementById('deleteWorkout').addEventListener('click', function(event){

function callDeleteWorkout(event){
                if(document.getElementById('editForm'))
                {
                    document.getElementById('editForm').remove();
                }
                var req = new XMLHttpRequest();
                console.log(event.target.parentNode.textContent);
                var id = event.target.parentNode.firstElementChild.textContent;
                req.open('GET', hostname + port + "/delete?id=" + id, true);
                req.addEventListener("load", function(){
                if(req.status >= 200 && req.status < 400)
                {
                    console.log(req.responseText);
                    document.getElementById(id).remove();
                }

                else
                {
                    console.log("Error in network request: " + req.statusText);
                }
                
                            
            });

            event.preventDefault();  
            req.send(id); 
}


function callEditWorkout(event){

        var ebuttons = document.getElementsByClassName('editButton');
        for(var x = 0; x < ebuttons.length; x++)
        {
            ebuttons[x].disabled = true;
        }
        ebuttons = document.getElementsByClassName('deleteButton');
        for(var x = 0; x < ebuttons.length; x++)
        {
            ebuttons[x].disabled = true;
        }
        

        console.log(event.target.parentNode.textContent);
        var id = event.target.parentNode.firstElementChild.textContent;

        var curRow = event.target.parentNode.parentNode;
        var curElem = curRow.firstElementChild;

        var editForm = document.createElement("form");
        editForm.id = 'editForm';
        editForm.textContent = 'Edit workout ';
        var newID = document.createElement("input");
        newID.textContent = id;
        newID.setAttribute("type", "hidden");
        editForm.appendChild(newID); 
        var name = document.createElement("input");
        name.type = 'text';
        name.value = curElem.textContent;      
        name.textContent = 'Workout Name';  
        curElem = curElem.nextElementSibling;
        editForm.appendChild(name);
        var reps = document.createElement("input");
        reps.type = 'number';
        reps.value = curElem.textContent;
        reps.textContent = 'Reps';
        curElem = curElem.nextElementSibling;
        editForm.appendChild(reps);
        var weight = document.createElement("input");
        weight.type = 'number';
        weight.value = curElem.textContent;
        weight.textContent = 'Weight';
        curElem = curElem.nextElementSibling;
        editForm.appendChild(weight);
        var date = document.createElement("input");
        date.type = 'text';
        date.value = curElem.textContent;
        date.textContent = 'Date Performed';
        curElem = curElem.nextElementSibling;
        editForm.appendChild(date);
        var lb = document.createElement("input");
        lb.type = 'radio';
        lb.name = 'lbs';
        lb.value = 1;
        lb.textContent = 'LB';
        var kg = document.createElement("input");
        kg.type = 'radio';
        kg.name = 'lbs';
        kg.value = 0;
        kg.textContent = 'KG';
        var units = document.createElement('input');
        units.type = 'hidden'
        units.value = curElem.textContent;
      
        editForm.appendChild(lb);
        editForm.appendChild(kg);
        editForm.appendChild(units);

        var updateButton = document.createElement('input');
        updateButton.type = 'submit';
        updateButton.value= 'Update Workout';
        updateButton.id = 'updateWorkout';
        updateButton.addEventListener('click', function(e){



                var req = new XMLHttpRequest();
                var id = e.target.parentNode.firstElementChild.textContent;
                

                var par = e.target.parentNode;
                var curElem = par.firstElementChild;
                curElem = curElem.nextElementSibling;

                var name = curElem.value;
                curElem = curElem.nextElementSibling;
                var reps = curElem.value;
                curElem = curElem.nextElementSibling;
                var weight = curElem.value;
                curElem = curElem.nextElementSibling;
                var date = curElem.value;
                curElem = curElem.nextElementSibling;

                var lbs;
                if(curElem.nextElementSibling.nextElementSibling.value == 'LB')
                {
                    lbs = 1;
                }
                if(curElem.nextElementSibling.nextElementSibling.value == 'KG')
                {
                    lbs = 0;
                }
                if(curElem.checked)
                {
                    lbs = 1;
                }

                if(curElem.nextElementSibling.checked)
                {
                    lbs = 0;
                }
                req.open('GET', hostname + port + "/safe-update?id=" + id + "&name=" + name + "&reps=" + reps + "&weight=" + weight + "&date=" + date + "&lbs=" + lbs, true);
                req.addEventListener("load", function(){
                if(req.status >= 200 && req.status < 400)
                {
                   
                    var response = JSON.parse(req.responseText);
                    console.log(response);//req.responseText);
                    document.getElementById('editForm').remove();
                    document.getElementById(id).style.backgroundColor = 'transparent';

                    for(var x = 0; x < response.length; x++)
                    {
                        if(response[x].id == id)
                        {
                            var curRow = document.getElementById(id);
                            var curElem = curRow.firstChild

                            curElem.textContent = response[x].name;
                            curElem = curElem.nextElementSibling;
                            curElem.textContent = response[x].reps;
                            curElem = curElem.nextElementSibling;
                            curElem.textContent = response[x].weight;
                            curElem = curElem.nextElementSibling;
                            curElem.textContent = response[x].date.substring(0,10);
                            curElem = curElem.nextElementSibling;
                            if(response[x].lbs == 1){
                                curElem.textContent = "LB";
                            }
                            else if(response[x].lbs == 0){
                                curElem.textContent = "KG";
                            }
                        }
                    }

                    var ebuttons = document.getElementsByClassName('editButton');
                    for(var x = 0; x < ebuttons.length; x++)
                    {
                        ebuttons[x].disabled = false;
                    }
                    ebuttons = document.getElementsByClassName('deleteButton');
                    for(var x = 0; x < ebuttons.length; x++)
                    {
                        ebuttons[x].disabled = false;
                    }
                                     
                }

                else
                {
                    console.log("Error in network request: " + req.statusText);
                }
                
                            
            });

            e.preventDefault();  
            req.send(id); 



        });

        editForm.appendChild(updateButton);

        curRow.style.backgroundColor = 'yellow';

        document.body.appendChild(editForm);

        event.preventDefault();
        //curRow.insertAdjacentElement('afterend', editForm);

}
        
 
