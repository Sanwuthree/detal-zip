const archiver = require("archiver");
const listdir = require("list-dir");
const unzip = require("unzip")
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const md5 = require("md5");

function compare_files(new_dirname, old_dirname, archive) {
    let f2files = listdir.sync(new_dirname);
    const count = f2files.length;
    let it = 0;
    f2files.forEach((element) => {
        new_file_path = path.join(new_dirname, element.toString());
        old_file_path = path.join(old_dirname, element.toString());
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
            console.log(it + "/" + count + "   " + new_file_path);
            if (it == count) {
                archive.finalize();
                setTimeout(function() {
                    deleteall(new_dirname);
                    deleteall(old_dirname);
                }, 1000);
            }
        })
    });
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
module.exports.detal = function (newzip, oldzip, outzip) {
    let newdirname = path.basename(newzip, ".zip");
    let olddirname = path.basename(oldzip, ".zip");
    let isOldZipExtract = false;
    let isNewZipExtract = false;
    let outzipstream = fs.createWriteStream(outzip);
    let archive = archiver("zip");
    archive.pipe(outzipstream);
    console.log("Extracting files.....")
    fs.createReadStream(oldzip).pipe(unzip.Extract({ path: olddirname })).on("close", () => {
        isOldZipExtract = true;
        if (isNewZipExtract) {
            compare_files(newdirname, olddirname, archive);
        }
    })
    fs.createReadStream(newzip).pipe(unzip.Extract({ path: newdirname })).on("close", () => {
        isNewZipExtract = true;
        if (isOldZipExtract) {
            compare_files(newdirname, olddirname, archive);
        }
    })

}