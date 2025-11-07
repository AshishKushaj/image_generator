import {z} from "zod"

export const TrainModel= z.object({
    name:z.string(),
    type: z.enum(["Male","Female","Others"]),
    age: z.number(),
    ethinicity: z.enum(["SouthAsian","EastAsian","SouthEastAsian","MiddleEastern","Pacific","Hispanic","Black","White"]),

    eyeColor:z.enum(["Brown","Blue","Hazel","Green","Gray"]),
    bald: z.boolean(),

    images: z.array(z.string())
})

export const GenerateImage=z.object({
    modelId: z.string(),
    prompt: z.string(),
    number: z.number()
})

export const GenerateFromPack= z.object({
    modelId: z.string(),
    packId: z.string(),
})