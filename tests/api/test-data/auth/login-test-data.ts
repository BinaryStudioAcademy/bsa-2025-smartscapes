import {
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
	NUMBER_1,
} from "../../../consts/validation-consts.js";

const loginTestDataSet = [
	{
		expectedResponse: {
			errorMessage: "Email is required.",
			status: 422,
		},
		label: "Login with empty values",
		payload: { email: "", password: "" },
	},
	{
		expectedResponse: {
			errorMessage: "Email is required.",
			status: 422,
		},
		label: "Login with empty email",
		payload: {
			email: "",
			password: "ValidPass123!",
		},
	},
	{
		expectedResponse: {
			errorMessage: "Password is required.",
			status: 422,
		},
		label: "Login with empty password",
		payload: {
			email: "validuser@example.com",
			password: "",
		},
	},
	{
		expectedResponse: {
			errorMessage: "Password is required.",
			status: 422,
		},
		label: "Login with password that contains only spaces.",
		payload: {
			email: "validuser@example.com",
			password: "     ",
		},
	},
	{
		expectedResponse: {
			errorMessage: "Email is required.",
			status: 422,
		},
		label: "Login with email that contains only spaces.",
		payload: {
			email: "      ",
			password: "ValidPass123!",
		},
	},
	{
		expectedResponse: {
			errorMessage: "Password must be at least 6 characters long.",
			status: 422,
		},
		label: "Login with short password (5 symbols)",
		payload: {
			email: "validuser@example.com",
			password: "A".repeat(MIN_PASSWORD_LENGTH - NUMBER_1),
		},
	},
	{
		expectedResponse: {
			errorMessage: "Password must be at most 64 characters long.",
			status: 422,
		},
		label: "Login with long password (65 symbols)",
		payload: {
			email: "validuser@example.com",
			password: "A".repeat(MAX_PASSWORD_LENGTH + NUMBER_1),
		},
	},
];

export { loginTestDataSet };
