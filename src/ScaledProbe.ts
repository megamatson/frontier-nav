import _ from "lodash";
import Probe from "./Probe";

export default abstract class ScaledProbe extends Probe {
	protected constructor(public readonly level: number) {
		super();
	}

	abstract getMinimumLevel(): number;
	abstract getMaximumLevel(): number;
}

/** Restricts level to [`minimumLevel`, `maximumLevel`] & Integers */
export function ScaledProbeRange<min extends number, max extends number>(
	minimumLevel: min,
	maximumLevel: max
) {
	if (minimumLevel > maximumLevel)
		throw new Error(
			`minimumLevel (${minimumLevel}) > maximumLevel (${maximumLevel})`
		);

	abstract class ScaledProbeRangeClass extends ScaledProbe {
		static readonly minimumLevel: min = minimumLevel;
		static readonly maximumLevel: max = maximumLevel;

		protected constructor(level: number) {
			if (!_.isInteger(level))
				throw new Error(`level ${level} is not an integer`);

			if (!(
				ScaledProbeRangeClass.minimumLevel <= level &&
				level <= ScaledProbeRangeClass.maximumLevel
			))
				throw new Error(
					`level ${level} is not in range [` +
					ScaledProbeRangeClass.minimumLevel +
					', ' +
					ScaledProbeRangeClass.maximumLevel +
				']');

			super(level);
		}

		getMinimumLevel() {
			return ScaledProbeRangeClass.minimumLevel;
		}

		getMaximumLevel() {
			return ScaledProbeRangeClass.maximumLevel;
		}
	}

	return ScaledProbeRangeClass;
}