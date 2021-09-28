

const jsonfile = require('jsonfile')
const fs = require('fs');
const path = require('path');
let ftsf = require('node-json-file-tree').FileTreeSeedFactory;
var filelist = []
async function persist(obj, file) {
    await jsonfile.writeFile(file, obj, {
        spaces: 2,
        EOL: '\r\n'
    }, function(err) {
        if (err) {
            console.error(err)
        }
    })
}
// generate file tree seed from factory
ftsf.get().then(seed => { 
    // "grow" file tree from seed
    seed.getFileTree("C:\\Users\\Steve\\onedrive\\desktop\\").then(tree => {
   
    filelist = filelist.concat(tree.files)
    persist(filelist,"results.json")

    });
});

