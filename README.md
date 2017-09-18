# detal-zip

### compare two zip file, and make detal zip

### Installation
~~~
npm install detal-zip
~~~
## Useage
~~~javascript
const cm=require("detal-zip");

cm.detal("a2.zip","a1.zip","out.zip")

cm.on("prograss",(compared,total,filename)=>{
    console.log(compared,total,filename)
})
~~~