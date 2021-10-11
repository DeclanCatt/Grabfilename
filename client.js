var data = {};

const usedResources = window.performance.getEntriesByType("resource").map(function(obj) {
    if (obj.name.includes("localhost:8081") ) {
        return obj.name.split("http://localhost:8081/")[1]
    }
}).filter(function( element ) {return element !== undefined;});

var xhr = new XMLHttpRequest();
xhr.open("POST", "http://localhost:3001/client-list");

xhr.setRequestHeader("Accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }
};

// build data to send
data.resources = usedResources;
data.id = "cstream"
xhr.send(JSON.stringify(data));