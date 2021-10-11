// Requirements
const fs = require('fs');
const path = require('path');
const ftsf = require('node-json-file-tree').FileTreeSeedFactory;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

// Global variables
var filelist = []

// Save object to JSON File
async function persist(obj, file) {
    await jsonfile.writeFile(file, obj, {
        spaces: 2,
        EOL: '\r\n'
    }, function (err) {
        if (err) {
            console.error(err)
        }
    })
}

async function sendData(tree) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3001/push-list");

    xhr.setRequestHeader("Accept", "application/json");
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        console.log(xhr.status);
        console.log(xhr.responseText);
    }
    };
    data = {}
    data.id = "cstream"
    data.resources = tree
    xhr.send(JSON.stringify(data));
}

// generate file tree seed from factory
ftsf.get().then(async (seed) => {
    // "grow" file tree from seed
    var fileroot = "C:/Users/Steve/OneDrive/Desktop/test2/cstream/"
    var endroot = "portal"
    console.log(path.join(fileroot, endroot))
    var tree = await seed.getFileTree("C:\\Users\\Steve\\OneDrive\\Desktop\\test2\\cstream\\portal\\").then(async (tree) => {
        return tree.files.map(function(file) {
            return file.split(fileroot)[1]
          })
    });
    sendData(tree)
});
