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

function main(){
    const config = require(path.join(__dirname, "config.json"));
    var argv = require('yargs')
    .option('template',{
        alias: 't',
        describe:'Tempalte name',
        default: 'default'       
    })
    .option('dir',{
        alias: 'd',
        describe:'Project Directory',
        default: '.'       
    })
    .help()
    .argv

    if(config[argv.template] === undefined){
        console.log(`Loading template error: no such template name.\nAvailable names:\n\n${Object.keys(config)}\n`);
        process.exit()
    }
    console.log(`Trying to initialize with template ${argv.template}...\nDescription:\n${config[argv.template].description}\n`);
    let root_dir = argv.dir;
    createDir(root_dir);
    config[argv.template].dirs.forEach(dir => createDir(path.join(root_dir ,dir)))
    config[argv.template].files.forEach(fname => createFile(root_dir, config[argv.template].template_root, fname))
}

main()
