import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

const getRelativeTime = (date: Date): string => {
	return formatDistanceToNow(date, {
		addSuffix: true,
		locale: enUS,
	});
};

export { getRelativeTime };
