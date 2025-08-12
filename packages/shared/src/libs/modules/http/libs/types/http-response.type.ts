type HTTPResponse<T = unknown> = Omit<Response, "json"> & {
	json(): never | Promise<T>;
};

export { type HTTPResponse };
