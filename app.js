const archiver = require("archiver");
const listdir = require("list-dir");
const unzip = require("unzip")
const fs = require("fs");
const crypto=require("crypto")
const path=require("path")
let f1 = "./lantusupei-6.3.zip";
let f2 = "./lantusupei-6.4.zip";
const md5=require("md5");
let output=fs.createWriteStream("arciv.zip");
let archive=archiver("zip");
let isOldZipExtract = false;
let isNewZipExtract=false;
archive.pipe(output)
fs.createReadStream(f1).pipe(unzip.Extract({ path: "lantusupei-6.3" })).on("close", () => {
    console.log("f1 ok");
    isOldZipExtract = true;
    if(isNewZipExtract){
        compare_files("lantusupei-6.4","lantusupei-6.3")
    }
})
fs.createReadStream(f2).pipe(unzip.Extract({ path: "lantusupei-6.4" })).on("close", () => {
    console.log("f2")
    isNewZipExtract=true;
    if (isOldZipExtract) {
        compare_files("lantusupei-6.4","lantusupei-6.3")
    }
})
function compare_files(new_dirname, old_dirname) {
    let f2files = listdir.sync(new_dirname);
    const count=f2files.length;
    let it=0;
    f2files.forEach((element) => {
        new_file_path=path.join(new_dirname,element.toString());
        old_file_path= path.join(old_dirname,element.toString());
        //console.log(old_file_path)
        it++
        console.log(it+"/"+count+"   "+new_file_path)
        if(!fs.existsSync(old_dirname)){
            archive.file(new_file_path,{name:element})
        }else{
            let oldmd5=md5(fs.readFileSync(old_file_path));
            let newmd5=md5(fs.readFileSync(new_file_path));
            if(oldmd5!=newmd5){
                console.log("add file"+new_file_path+"*******************"+ element)
                archive.file(new_file_path,{name:element})
            }
        }
    });
    archive.finalize();
    console.log("zip arcived")
}