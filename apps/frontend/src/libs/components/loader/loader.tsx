import { type JSX } from "react";

import Spinner from "./spinner.svg?react";
import styles from "./styles.module.css";

type Properties = {
	sizeInPx?: number;
};

const AVERAGE_LOADER_SIZE_IN_PX = 32;

const Loader = ({
	sizeInPx = AVERAGE_LOADER_SIZE_IN_PX,
}: Properties): JSX.Element => {
	return (
		<Spinner className={styles["loader"]} height={sizeInPx} width={sizeInPx} />
	);
};

export { Loader };
