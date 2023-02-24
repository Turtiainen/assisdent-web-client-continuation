import json from "../temp/schema.json"
import {DtoEntity} from "../types/DtoEntity";
import {DtoSchema} from "../types/DtoSchema";

export const printEntities = (...args: string[]) => {
  const temp = json as DtoSchema
  const allEntities = temp.MetaData.Entities

  if (args.length > 0) {
    return allEntities.filter((entity: DtoEntity) => args.includes(entity.Name))
  } else {
    console.log("entiteettejä on yht: ", allEntities.length)
    console.log()

    allEntities.map((entity: DtoEntity) => {
      console.log(entity.Name)
    })
  }
}
