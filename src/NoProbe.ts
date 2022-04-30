import FlyweightHelper from "./Flyweight";
import Probe from "./Probe";

export class NoProbeClass extends Probe {
	private static readonly helper = new FlyweightHelper<NoProbeClass>();

	private constructor() {
		super();
		NoProbeClass.helper.add(
			this,
			0,
			'no probe',
			'null probe',
			'none',
			'no',
			'null',
			''
		);
	}

	getCreditsOutputModifier(): number {
		return 0;
	}

	getMiraniumOutputModifier(): number {
		return 0;
	}

	getName(): string {
		return 'No Probe';
	}

	getStorageOutput(): number {
		return 0;
	}

	getBoostModifier(): number {
		return 0;
	}

	protected sightseeingFormula(): number {
		return 0;
	}

	canChain(): boolean {
		return false;
	}

	static get(alias: any) {
		if (!alias)
			return this.noProbe;
		return this.helper.get(alias);
	}

	static getAll(): Probe[] {
		return [this.noProbe];
	}

	static readonly noProbe = new NoProbeClass();
}

Probe.register(NoProbeClass);

export default NoProbeClass.noProbe;

