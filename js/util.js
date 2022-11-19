'use strict';
function showMessage (message){
	document.getElementById("message").innerHTML = message;
}

function showMessageInElement (id, message){
	document.getElementById(id).innerHTML = message;
}

function cleanMessage (){
	document.getElementById("message").innerHTML = "";
	document.getElementById("message").style.fontSize = "150%";
}

function cleanMessageInElement (id){
	document.getElementById(id).innerHTML = "";
}

function addMessage (message){
	document.getElementById("message").innerHTML += message + "<br>";
}

function addMessageInElement (id, message){
	document.getElementById(id).innerHTML += message + "<br>";
}

function displayObject (obj){
	let objType = (obj.constructor)? obj.constructor.name : typeof obj;
	addMessage(objType + " {");
	for(let property in obj){
		(property === "constructor" || typeof obj[property] === "function")?
			addMessage(property + ": " + obj[property].name + ","):
			addMessage(property + ": " + obj[property] + ",");
	}
	addMessage("}");
}

function displayObjectInElement (id, obj){
	let objType = obj.constructor.name || typeof obj;
	addMessageInElement(id, objType + " {");
	for(let property in obj){
		(property === "constructor" || typeof obj[property] === "function")?
			addMessageInElement(id, property + ": " + obj[property].name + ","):
			addMessageInElement(id, property + ": " + obj[property] + ",");
	}
	addMessageInElement(id, "}");
}
