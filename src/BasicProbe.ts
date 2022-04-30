import FlyweightHelper from "./Flyweight";
import Probe from "./Probe";

export class BasicProbeClass extends Probe {
	private static helper = new FlyweightHelper<BasicProbeClass>();

	private constructor() {
		super();
		BasicProbeClass.helper.add(this, this.getName(), 'basic');
	}

	protected sightseeingFormula(): number {
		return 0;
	}

	getCreditsOutputModifier(): number {
		return 0.5;
	}

	getMiraniumOutputModifier(): number {
		return 0.5;
	}

	getBoostModifier(): number {
		return 1;
	}

	getStorageOutput(): number {
		return 0;
	}

	getName(): string {
		return 'Basic Probe';
	}

	canChain(): boolean {
		return false;
	}

	static get(alias: any) {
		return this.helper.get(alias);
	}

	static getAll(): Probe[] {
		return [this.basicProbe];
	}

	static readonly basicProbe = new BasicProbeClass();
}

Probe.register(BasicProbeClass);

export default BasicProbeClass.basicProbe;