import _ from "lodash";

export default function getProbeComboModifier(chainSize: number): number {
	if (!_.isInteger(chainSize))
		throw new Error(`Chain size (${chainSize}) is not an integer`);

	if (chainSize < 0)
		throw new Error(`Chain size (${chainSize}) < 0`);

	if (chainSize < 3)
		return 1;
	else if (chainSize < 5)
		return 1.30;
	else if (chainSize < 8)
		return 1.50;
	else
		return 1.80;
}