import { ScaledProbeRange } from "./ScaledProbe";

function MockScaledProbeRange(min: number, max: number) {
	return class extends ScaledProbeRange(min, max) {
		public constructor(level: number) {
			super(level);
		}

		sightseeingFormula(): number {
			return 0;
		}

		getCreditsOutputModifier(): number {
			return 0;
		}

		getMiraniumOutputModifier(): number {
			return 0;
		}

		getName(): string {
			return `Mock Scaled Probe ${this.level}`;
		}

		getShortName(): string {
			return `MSP(${this.level})`;
		}

		getBoostModifier(): number {
			return 0;
		}

		canChain(): boolean {
			return false;
		}

		getStorageOutput(): number {
			return 0;
		}
	};
}

test('does not allow min > max', () => {
	expect(() => ScaledProbeRange(1, 0)).toThrow();
});


test('allows min = max', () => {
	const level = 1;
	const OneLevelProbe = MockScaledProbeRange(level, level);

	const instance = new OneLevelProbe(level);
	expect(instance.level).toBe(level);

	expect(() => new OneLevelProbe(level + 1)).toThrow();
	expect(() => new OneLevelProbe(level - 1)).toThrow();
});


test('[1, 10]', () => {
	const [min, max] = [1, 10];

	const NewProbe = MockScaledProbeRange(min, max);

	for (let level = min; level <= max; level++)
		expect(new NewProbe(level).level).toBe(level);

	expect(() => new NewProbe(min - 1)).toThrow();
	expect(() => new NewProbe(max + 1)).toThrow();
});