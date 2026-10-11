
type RepositoryDelegate<T> = {
  findMany(args?: any): Promise<T[]>;
  findUnique(args: any): Promise<T | null>;
  create(args: any): Promise<T>;
  delete(args: any): Promise<T>;
  count(args?: any): Promise<number>;
  update(args: any): Promise<T>;
};

export default abstract class BaseRepository<
  T,
  TCreate,
  TId extends string | number = number
> {
  constructor(
    protected readonly modelClient: RepositoryDelegate<T>
  ) {}

  getAll(options: any = {}): Promise<T[]> {
    return this.modelClient.findMany(options);
  }

  getById(id: TId): Promise<T | null> {
    return this.modelClient.findUnique({
      where: { id },
    });
  }

  create(data: TCreate): Promise<T> {
    return this.modelClient.create({
      data,
    });
  }

  delete(id: TId): Promise<T> {
    return this.modelClient.delete({
      where: { id },
    });
  }
}
