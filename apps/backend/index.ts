import  express  from "express";
import {GenerateFromPack,GenerateImage, TrainModel} from "common/types"

const app= express();
const port= process.env.PORT || 8080;



app.listen(port,()=>{
    console.log(`listining to  ${port}`)
})

