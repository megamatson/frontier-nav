import BasicProbe from "./BasicProbe";
import NoProbe from "./NoProbe";
import Probe from "./Probe";

export function isBasic(probe: Probe): boolean {
	return probe === NoProbe || probe === BasicProbe;
}
