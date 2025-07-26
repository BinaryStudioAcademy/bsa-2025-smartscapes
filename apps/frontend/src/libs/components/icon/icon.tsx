import { type IconName } from "~/libs/types/types.js";

import { iconNameToSvg } from "./libs/maps/maps.js";

type Properties = {
	height: number;
	name: IconName;
	width: number;
};

const Icon = ({ height, name, width }: Properties): React.JSX.Element => {
	const IconComponent = iconNameToSvg[name];

	return <IconComponent height={height} width={width} />;
};

export { Icon };
