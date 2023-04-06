export enum PropertyValueMutabilityType {
  /** <summary>
   *  Value can be both written and read.
   *  </summary>
   */
  ReadWrite = 0,

  /** <summary>
   *  Value can be initialized when entity is created but otherwise it is read only.
   *  </summary>
   */
  ReadOnlyCreatable = 1,

  /** <summary>
   *  Value can be only read and it cannot be initialized even when entity is created.
   *  </summary>
   */
  ReadOnly = 2,
}
