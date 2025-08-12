import { type ReactNode } from "react";

import { type TabItemKey } from "./tab-item-key.type.js";

type TabItem = {
	element: ReactNode;
	id: TabItemKey;
	label: string;
};

export { type TabItem };
