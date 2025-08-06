const authUserSchema = {
	"properties": {
		"data": {
			"properties": {
				"email": {
					"type": "string",
				},
				"firstName": {
					"type": "string",
				},
				"id": {
					"type": "integer",
				},
				"lastName": {
					"type": "string",
				},
			},
			"required": ["email", "firstName", "id", "lastName"],
			"type": "object",
		},
	},
	"required": ["data"],
	"type": "object",
};

export { authUserSchema };
