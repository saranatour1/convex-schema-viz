// we get the schema values here without actually creating changes to the actual schema;
import { v } from "convex/values";
import { action } from "./_generated/server";
import { cleanUpSchema } from "./utils";
export const view = action({
  args:{schemaObject:v.string()},
  handler: async(ctx,args)=>{
    // validate the schema string
    const afterValidation = cleanUpSchema(args.schemaObject)
    console.log(afterValidation)
  }
})

 