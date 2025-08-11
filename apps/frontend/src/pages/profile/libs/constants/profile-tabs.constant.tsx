import { type TabItem } from "~/libs/components/tab-container/tab-container.js";
import {
	MyReviews,
	UserDetails,
} from "~/pages/profile/libs/components/components.js";

const PROFILE_TABS: TabItem[] = [
	{
		element: <UserDetails />,
		id: "user-details",
		label: "User details",
	},
	{
		element: <MyReviews />,
		id: "my-reviews",
		label: "My reviews",
	},
];

export { PROFILE_TABS };
