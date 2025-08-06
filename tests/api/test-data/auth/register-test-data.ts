import {
	MAX_FIRSTNAME_LENGTH,
	MAX_PASSWORD_LENGTH,
	MIN_PASSWORD_LENGTH,
	NUMBER_1,
} from "../../../consts/validation-consts.js";
import { generateId } from "../../../helpers/generate-data.js";

const signupTestDataSet = [
	{
		expectedResponse: {
			errorMessages: "First name is required.",
			status: 422,
		},
		label: "Register with empty first name",
		payload: {
			confirmPassword: "Valid123!",
			email: "test@example.com",
			firstName: "",
			lastName: "Smith",
			password: "Valid123!",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Last name is required.",
			status: 422,
		},
		label: "Register with empty last name",
		payload: {
			confirmPassword: "Valid123!",
			email: "test@example.com",
			firstName: "kpk",
			lastName: "",
			password: "Valid123!",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Email is required.",
			status: 422,
		},
		label: "Register with empty email",
		payload: {
			confirmPassword: "Valid123!",
			email: "",
			firstName: "kmoj",
			lastName: "Smith",
			password: "Valid123!",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Password is required.",
			status: 422,
		},
		label: "Register with empty password",
		payload: {
			confirmPassword: "Valid123!",
			email: "test@example.com",
			firstName: "kmoj",
			lastName: "Smith",
			password: "",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Password is required.",
			status: 422,
		},
		label: "Register with empty confirm password",
		payload: {
			confirmPassword: "",
			email: "test@example.com",
			firstName: "kmoj",
			lastName: "Smith",
			password: "111111",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Email format is wrong.",
			status: 422,
		},
		label: "Register with invalid email format",
		payload: {
			confirmPassword: "Valid123!",
			email: "invalidemail",
			firstName: "John",
			lastName: "Smith",
			password: "Valid123!",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Password must be at least 6 characters long.",
			status: 422,
		},
		label: "Register with short password (5 symbols)",
		payload: {
			confirmPassword: "A".repeat(MIN_PASSWORD_LENGTH - NUMBER_1),
			email: "test@example.com",
			firstName: "John",
			lastName: "Smith",
			password: "A".repeat(MIN_PASSWORD_LENGTH - NUMBER_1),
		},
	},
	{
		expectedResponse: {
			errorMessages: "Password must be at most 64 characters long.",
			status: 422,
		},
		label: "Register with long password (65 symbols)",
		payload: {
			confirmPassword: "A".repeat(MAX_PASSWORD_LENGTH + NUMBER_1),
			email: "test@example.com",
			firstName: "John",
			lastName: "Smith",
			password: "A".repeat(MAX_PASSWORD_LENGTH + NUMBER_1),
		},
	},
	{
		expectedResponse: {
			errorMessages: "Passwords do not match.",
			status: 422,
		},
		label: "Register with mismatched confirm password",
		payload: {
			confirmPassword: "validpass123",
			email: "test@example.com",
			firstName: "John",
			lastName: "Smith",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: "First name is required.",
			status: 422,
		},
		label: "Register with only spaces in first name",
		payload: {
			confirmPassword: "ValidPass123",
			email: "test@example.com",
			firstName: "   ",
			lastName: "Smith",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: [],
			status: 201,
		},
		label: "Register with max length first name (64 symbols)",
		payload: {
			confirmPassword: "ValidPass123",
			email: `test${generateId()}@example.com`,
			firstName: "A".repeat(MAX_FIRSTNAME_LENGTH),
			lastName: "Smith",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: "First name must be at most 64 characters long",
			status: 422,
		},
		label: "Register with max length first name + 1 (65 symbols)",
		payload: {
			confirmPassword: "ValidPass123",
			email: "test@example.com",
			firstName: "A".repeat(MAX_FIRSTNAME_LENGTH + NUMBER_1),
			lastName: "Smith",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: "Last name must contain only Latin letters.",
			status: 422,
		},
		label: "Register with non-latin characters in last name",
		payload: {
			confirmPassword: "ValidPass123",
			email: "test@example.com",
			firstName: "John",
			lastName: "Іванов!",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: "First name must contain only Latin letters.",
			status: 422,
		},
		label: "Register with non-latin characters in first name",
		payload: {
			confirmPassword: "ValidPass123",
			email: "test@example.com",
			firstName: "Іванов!",
			lastName: "Joe",
			password: "ValidPass123",
		},
	},
	{
		expectedResponse: {
			errorMessages: [],
			status: 201,
		},
		label: "Register with valid data",
		payload: {
			confirmPassword: "ValidPass123",
			email: `test${generateId()}@example.com`,
			firstName: "Test",
			lastName: "User",
			password: "ValidPass123",
		},
	},
];

export { signupTestDataSet };
