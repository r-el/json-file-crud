export interface CrudOptions {
  idField?: string;
  autoId?: boolean;
  uniqueFields?: string[];
}

export type Callback<T> = (err: Error | null, result: T) => void;

export default class JsonFileCRUD<T = any> {
  constructor(filePath: string, options?: CrudOptions);

  readonly filePath: string;
  readonly idField: string;
  readonly autoId: boolean;
  readonly uniqueFields: string[];

  create(item: T, callback: Callback<T>): void;
  readAll(callback: Callback<T[]>): void;
  findById(id: any, callback: Callback<T>): void;
  findBy(filterFn: (item: T) => boolean, callback: Callback<T[]>): void;
  count(callback: Callback<number>): void;
  update(id: any, data: Partial<T>, callback: Callback<T>): void;
  delete(id: any, callback: Callback<T>): void;
  deleteAll(callback: (err: Error | null) => void): void;
  writeAll(items: T[], callback: (err: Error | null) => void): void;
  processWriteQueue(): void;
}

export function createCrud<T = any>(filePath: string, options?: CrudOptions): JsonFileCRUD<T>;
