const signupSchema = {
	"properties": {
		"data": {
			"properties": {
				"token": {
					"type": "string",
				},
				"user": {
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
			"required": ["token", "user"],
			"type": "object",
		},
	},
	"required": ["data"],
	"type": "object",
};

export { signupSchema };
