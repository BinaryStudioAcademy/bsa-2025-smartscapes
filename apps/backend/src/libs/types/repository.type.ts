type Repository<T = unknown> = Partial<{
	create(payload: unknown): Promise<T>;
	delete(id: number): Promise<boolean>;
	findAll(payload: unknown): Promise<T[]>;
	findById(id: number): Promise<null | T>;
	update(id: number, payload: unknown): Promise<null | T>;
}>;

export { type Repository };
