export type PartialOmitWithRequired<
  T,
  OmitKeys extends keyof T,
  RequiredKeys extends keyof T,
> = Partial<Omit<T, OmitKeys | RequiredKeys>> & Required<Pick<T, RequiredKeys>>;

export type PartialWithOmit<T, OmitKeys extends keyof T> = Partial<
  Omit<T, OmitKeys>
>;
