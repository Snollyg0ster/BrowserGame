export type AccessModifersOff<T> = {
  [key in keyof T]: T[key];
};

export type NestedObjectExtractor<
  Obj extends AccessModifersOff<Obj>,
  NestedObj
> = {
  [key in keyof NestedObj]: Obj[key];
};
