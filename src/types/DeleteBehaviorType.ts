export enum DeleteBehaviorType {
  /// <summary>
  /// Entity cannot be deleted (i.e. archived or destroyed)
  /// </summary>
  CannotDelete,

  /// <summary>
  /// When deleted, entity is archived (requires that ValidityBehavior has been set)
  /// </summary>
  Archive,

  /// <summary>
  /// When deleted, entity is destroyed (i.e. removed completely from database)
  /// </summary>
  Destroy,
}
