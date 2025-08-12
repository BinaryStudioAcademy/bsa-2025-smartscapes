import { type CollectionResult } from "./collection-result.type.js";

type Service<T = unknown> = Partial<{
	create(payload: unknown): Promise<T>;
	delete(id: number): Promise<boolean>;
	find(id: number): Promise<T>;
	findAll(options: unknown): Promise<CollectionResult<T>>;
	patch(id: number, payload: Partial<T>): Promise<T>;
	update(id: number, payload: Partial<T>): Promise<T>;
}>;

export { type Service };
