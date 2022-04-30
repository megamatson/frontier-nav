import FlyweightHelper from "./Flyweight";
import Probe from "./Probe";

export class StorageProbeClass extends Probe {
	private static helper = new FlyweightHelper<StorageProbeClass>();

	private constructor() {
		super();
		StorageProbeClass.helper.add(this, this.getName(), 'Storage');
	}

	getName(): string {
		return 'Storage Probe';
	}

	getMiraniumOutputModifier(): number {
		return 0.1;
	}

	getCreditsOutputModifier(): number {
		return 0.1;
	}

	getBoostModifier(): number {
		return 1;
	}

	getStorageOutput(chainBonus: number, boost: number): number {
		return Math.floor(
			3000 * chainBonus * boost
		);
	}

	protected sightseeingFormula(): number {
		return 0;
	}

	canChain(): boolean {
		return true;
	}

	static get(alias: any): StorageProbeClass {
		return StorageProbeClass.helper.get(alias);
	}

	static getAll(): StorageProbeClass[] {
		return StorageProbeClass.helper.getAll();
	}

	public static readonly storageProbe = new StorageProbeClass();
}

Probe.register(StorageProbeClass);

export default StorageProbeClass.storageProbe;