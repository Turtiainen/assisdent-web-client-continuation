export enum AssociationType {
  /// <summary>
  /// Specifies an association that conforms to UML composition rules: the current entity ('parent') owns the target
  /// entity/entities ('child/children'). The target entity becomes part of the composition hierarchy defined by current entity
  /// (or current entity's parent entity, recursively). If current entity is updated (or created) then child entities behind
  /// this association can be modified (i.e. their data can be modified also).
  /// </summary>
  Composition = 0,

  /// <summary>
  /// Specifies an association that conforms to UML aggregation rules: there is a weak association/relationship between the current entity
  /// and the target entity/entities but there is no parent/child relationship (one side of the association does not own the other side).
  /// Also, the target entity does not become part of the current entity's composition hierarchy. If current entity is updated (or created)
  /// then target entities CANNOT be modified (i.e. the data behind this association cannot be modified). Only the association itself can be
  /// modified (added or removed), i.e. new association can be made and existing association can be removed."
  /// </summary>
  Aggregation = 1,

  /// <summary>
  /// Specifies that the target object is part of the current entity, and that the target object should not have its own identity at all.
  /// Basically this means that one big entity has been split into multiple 'sub-entities'. In principle this 'association type' is not
  /// association at all (as both the source and the target are part of the same entity).
  /// </summary>
  SharedEntity = 2,
}
