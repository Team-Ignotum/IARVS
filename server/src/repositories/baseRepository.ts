
type RepositoryDelegate<T> = {
  findMany(args?: any): Promise<T[]>;
  findUnique(args: any): Promise<T | null>;
  create(args: any): Promise<T>;
  delete(args: any): Promise<T>;
  update(args: any): Promise<T>;
};

export default abstract class BaseRepository<
  T,
  TCreate = any,
  TUpdate = any,
  TId extends string | number = number
> {
  constructor(
    protected readonly modelClient: RepositoryDelegate<T>,
    private readonly idField: string = "id"
  ) {}

  getAll(options: any = {}): Promise<T[]> {
    return this.modelClient.findMany(options);
  }

  getById(id: TId): Promise<T | null> {
    return this.modelClient.findUnique({
      where: { [this.idField]: id },
    });
  }

  create(data: TCreate): Promise<T> {
    return this.modelClient.create({
      data,
    });
  }

  update(id: TId, data: TUpdate): Promise<T> {
    return this.modelClient.update({
      where: { [this.idField]: id },
      data,
    });
  }

  delete(id: TId): Promise<T> {
    return this.modelClient.delete({
      where: { [this.idField]: id },
    });
  }
}
