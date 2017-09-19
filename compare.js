const archiver = require("archiver");
const listdir = require("list-dir");
const unzip = require("unzip")
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const md5 = require("md5");
var events = require('events');

class Com extends events.EventEmitter {
    constructor() {
        super();
    }
    throwMessage(msg){
        this.emit("throw-message",msg)
    }
    detal(newzip, oldzip, outzip) {
        this.throwMessage("__dirname="+__dirname)
        let newdirname = path.basename(newzip, ".zip");
        let olddirname = path.basename(oldzip, ".zip");
        newdirname=path.join("tmp",newdirname);
        olddirname=path.join("tmp",olddirname);
        this.throwMessage("newdirname="+newdirname)
        this.throwMessage("olddirname="+olddirname)
        let isOldZipExtract = false;
        let isNewZipExtract = false;
        let outzipstream = fs.createWriteStream(outzip);
        let archive = archiver("zip");
        archive.pipe(outzipstream);
        this.throwMessage("Extracting files.....");
        if (fs.existsSync(newdirname)) {
            deleteall(newdirname);
        }
        if (fs.existsSync(olddirname)) {
            deleteall(olddirname)
        }
        fs.createReadStream(oldzip).pipe(unzip.Extract({ path: olddirname })).on("close", () => {
            isOldZipExtract = true;
            this.throwMessage("old zip file extracted")
            if (isNewZipExtract) {
                this.compare_files(newdirname, olddirname, archive);
            }
        }).on("data",(d)=>{
            this.throwMessage("data=>")
        })
        fs.createReadStream(newzip).pipe(unzip.Extract({ path: newdirname })).on("close", () => {
            isNewZipExtract = true;
            this.throwMessage("new zip file extracted")
            if (isOldZipExtract) {
                this.compare_files(newdirname, olddirname, archive);
            }
        })
    }
    compare_files(new_dirname, old_dirname, archive) {
        this.throwMessage("Start Compare")
        let f2files = listdir.sync(new_dirname);
        const count = f2files.length;
        let it = 0;
        f2files.forEach((element) => {
            let new_file_path = path.join(new_dirname, element.toString());
            let old_file_path = path.join(old_dirname, element.toString());
            fs.exists(old_file_path, (exists) => {
                if (exists) {
                    let oldmd5 = md5(fs.readFileSync(old_file_path));
                    let newmd5 = md5(fs.readFileSync(new_file_path));
                    if (oldmd5 != newmd5) {
                        archive.file(new_file_path, { name: element })
                    }
                } else {
                    archive.file(new_file_path, { name: element })
                }
                it++;
                //this.throwMessage(it + "/" + count + "   " + new_file_path);
                this.emit("prograss", it, count, new_file_path);
                if (it == count) {
                    archive.finalize();
                    setTimeout(() => {
                        deleteall(new_dirname);
                        deleteall(old_dirname);
                    }, 2000);
                }
            })
        });
    }
}
function deleteall(path) {
    var files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) { // recurse  
                deleteall(curPath);
            } else { // delete file  
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};



module.exports = new Com();
