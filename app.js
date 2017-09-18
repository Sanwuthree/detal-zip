const archiver = require("archiver");
const listdir = require("list-dir");
const unzip = require("unzip")
const fs = require("fs"),os=require("os")
const path=require("path")
let f1 = "./lantusupei-6.3.zip";
let f2 = "./lantusupei-6.3.zip";

let isOldZipExtract = false;
// fs.createReadStream(f1).pipe(unzip.Extract({ path: "lantusupei-6.3" })).on("close", () => {
//     console.log("f1 ok");
//     isOldZipExtract = true;
// })
// fs.createReadStream(f2).pipe(unzip.Extract({ path: "lantusupei-6.4" })).on("close", () => {
//     console.log("f2")
//     if (isOldZipExtract) {
//         //compare_files("lantusupei-6.4","lantusupei-6.3")
//     }
// })
compare_files("lantusupei-6.4","lantusupei-6.3")
function compare_files(new_dirname, old_dirname) {
    let f2files = listdir.sync(new_dirname);
    f2files.forEach((element) => {
        new_file_path=path.join(new_dirname,element.toString());
        old_file_path= path.join(old_dirname,element.toString());
        console.log(old_file_path)
        if(!fs.existsSync(old_dirname)){
            
        }else{
            //todo md5 check
        }
       
    });
}