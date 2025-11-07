import  express  from "express";
import {GenerateFromPack,GenerateImage, TrainModel} from "common/types"
import { prismaClient } from "db";
import type { OutputImages } from "../../packages/db/generated/prisma/client";


const app= express();
const port= process.env.PORT || 8080;
app.use(express.json())

const user_Id= "tempId"


app.post("/ai/training",async (req,res)=>{
    const parsedBody= TrainModel.safeParse(req.body);

    if(!parsedBody.success){
        res.status(411).json({err:"invalid input format for model training"})
        return;
    }

    
    const model=await prismaClient.model.create({
        data:{
            name:parsedBody.data.name,
            type:parsedBody.data.type,
            age:parsedBody.data.age,
            ethinicity:parsedBody.data.ethinicity,
            eyeColor:parsedBody.data.eyeColor,
            bald:parsedBody.data.bald,
            userId:user_Id
        }
    })

    res.status(200).json({modelId:model.id})
})



app.post("/ai/generate",async (req,res)=>{
    const parsedData= GenerateImage.safeParse(req.body)

    if(!parsedData.success){
         res.status(411).json({err:"invalid input format for generating image"})
        return;
    }

    // api to generate 
    // (modelId, prompt, number of image)

    const output=await prismaClient.outputImages.create({
        data:{
            prompt:parsedData.data.prompt,
            modelId:parsedData.data.modelId,
            userId:user_Id,
            imageURL:""
        }
    })
    
    res.status(200).json({
        ImageId:output.id
    })
})


app.post("/pack/generate",async(req,res)=>{
    const parsedBody=GenerateFromPack.safeParse(req.body);

    if(!parsedBody.success){
         res.status(411).json({err:"invalid input format for training with pack"})
        return;
    }

    const prompts= prismaClient.packPrompt.findMany({
        where:{
            packId: parsedBody.data.packId
        }
    })

    const images=await prismaClient.outputImages.createManyAndReturn({
            data:prompts.map((prompt:String)=>({
                prompt,
                modelId:parsedBody.data.modelId,
                userId:user_Id,
                imageURL:""
            }))
        })
    
    res.status(200).json({
        images: images.map((i:OutputImages)=>i.id)
    })
})


//get all packs
app.get("/pack/bulk",async(req,res)=>{
    
    const ids=req.query.ids as string;
    const limit= req.query.limit ? parseInt(req.query.limit as string): 10;
    const offset= req.query.offset ? parseInt(req.query.offset as string): 0;

    const imageData= await prismaClient.outputImages.findMany({
        where:{
            id: {in:ids},
            userId: user_Id
        },
        take: limit,
        skip: offset
    })

    res.status(200).json({
        images: imageData
    })
})





app.listen(port,()=>{
    console.log(`listining to  ${port}`)
})



