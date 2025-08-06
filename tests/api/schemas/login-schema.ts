const loginSchema = {
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
						"id": {
							"type": "integer",
						},
					},
					"required": ["email", "id"],
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

export { loginSchema };
