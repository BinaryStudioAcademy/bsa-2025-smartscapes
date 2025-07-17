import { Button } from "~/libs/components/components.js";

type Properties = {
	onSubmit: () => void;
};

const SignInForm = ({ onSubmit }: Properties): React.JSX.Element => {
	return (
		<form noValidate onSubmit={onSubmit}>
			<h1>Sign In</h1>
			<Button label="Sign in" />
		</form>
	);
};

export { SignInForm };
