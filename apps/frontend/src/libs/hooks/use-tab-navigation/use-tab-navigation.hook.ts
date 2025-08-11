import { useEffect, useSearchParams } from "~/libs/hooks/hooks.js";

const useTabNavigation = (
	initialTabId: string,
	queryParameterName: string = "tab",
): {
	activeTabId: string;
	handleTabChange: (tabId: string) => void;
} => {
	const [searchParameters, setSearchParameters] = useSearchParams();

	const activeTabId = searchParameters.get(queryParameterName) ?? initialTabId;

	const handleTabChange = (tabId: string): void => {
		setSearchParameters((previousParameters) => {
			const currentParameters = Object.fromEntries(
				previousParameters.entries(),
			);

			const newParameters = {
				...currentParameters,
				[queryParameterName]: tabId,
			};

			return newParameters;
		});
	};

	useEffect(() => {
		if (!searchParameters.get(queryParameterName)) {
			handleTabChange(initialTabId);
		}
	}, [initialTabId, queryParameterName]);

	return { activeTabId, handleTabChange };
};

export { useTabNavigation };
