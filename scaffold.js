#!/usr/bin/env node
var fs = require('fs')
var path = require('path');

function createDir(fname){
    try{
        fs.mkdirSync(fname)
        console.log(`Created directory: ${fname}`);
    } catch(err){
        if(err.code == 'EEXIST')
        {
            console.log(`Directory ${fname} already exist.`);
        } else{
            console.log(err);
        }
    }
}

function createFile(root_dir, tempalte_root, fname){
    fs.readFile(path.join(__dirname, tempalte_root, fname), 'utf8', function(err, contents) {
        if(err){
            return console.log(err);
        }
        fs.writeFile(path.join(root_dir, fname), contents, function(err) {
            if(err) {
                return console.log(err);
            }
            console.log(`File ${fname} created.`);
        });
    });
}

// function load_json(file){
//     
//     return obj
// }


function main(){
    const config = require(path.join(__dirname, "config.json"));
    var argv = require('yargs')
        .default('template', () => {
            return "default";
        })
        .default('root', () => {
            return ".";
        })
        .argv

    if(config[argv.template] === undefined){
        console.log(`Loading template error: no such template name.\nAvailable names:\n\n${Object.keys(config)}\n`);
        process.exit()
    }
    console.log(`Trying to initialize with template ${argv.template}...\nDescription:\n${config[argv.template].description}\n`);
    let root_dir = argv.root;
    createDir(root_dir);
    let dirs = ["css", "img", "js"]
    dirs.forEach(dir => createDir(path.join(root_dir ,dir)))
    let files = ["index.html", "css/style.css", "js/index.js"]
    files.forEach(fname => createFile(root_dir, config[argv.template].template_root, fname))
}

main()
