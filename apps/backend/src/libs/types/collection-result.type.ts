type CollectionResult<Item, Meta = undefined> = (Meta extends undefined
	? object
	: { meta: Meta }) & {
	items: Item[];
};

export { type CollectionResult };
