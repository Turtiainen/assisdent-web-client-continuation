import {printEntities} from "../utils/Entity";
import {DtoEntity} from "../types/DtoEntity";

type PrintEntitiesProps = {
  entityType: string
}

export const PrintEntities = ({entityType}: PrintEntitiesProps) => {
  const entities = printEntities(entityType)
  return (
    <div className={`flex px-4 py-2`}>
      {entities?.map((entity: DtoEntity) => {
        return (
          <div key={entity.Name}>
            <h3 className={`text-2xl`}>Entity: {entity.Name}</h3>
            <pre className={`text-xs`}>{JSON.stringify(entity, null, 4)}</pre>
          </div>
      )
      })}
    </div>
  )
}
