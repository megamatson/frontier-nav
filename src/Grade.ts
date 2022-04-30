import FlyweightHelper from "./Flyweight";

export type MiningGrade = Grade & {
	mining: number,
	isCombat(): true
};
export type RevenueGrade = Grade & {
	revenue: number,
	isRevenue(): true
};
export type CombatGrade = Grade & {isCombat(): true};

export default class Grade {
	private static helper = new FlyweightHelper<Grade>();

	private static supportsCombat  = new Set<CombatGrade>();
	private static supportsRevenue = new Set<RevenueGrade>();
	private static supportsMining  = new Set<MiningGrade>();

	private readonly rank: number;

	private constructor(
		public readonly letter: string,
		predecessor: null | Grade,
		public readonly mining:  number|null,
		public readonly revenue: number|null,
		private readonly combat: boolean
	) {
		Grade.helper.add(this, letter, `grade ${letter}`);

		this.rank = predecessor === null ? 1 : predecessor.rank + 1;

		if (this.isMining())
			Grade.supportsMining.add(this);

		if (this.isRevenue())
			Grade.supportsRevenue.add(this);

		if (this.isCombat())
			Grade.supportsCombat.add(this);
	}

	public isMining(this: this): this is MiningGrade {
		return this.mining !== null;
	}

	public isRevenue(this: this): this is RevenueGrade {
		return this.revenue !== null;
	}

	public isCombat(this: this): this is CombatGrade {
		return this.combat;
	}

	static get(alias: any) {
		return this.helper.get(alias);
	}

	/**
	 * @returns < 0 if a < b, > 0 if a > b, = 0 if a == b
	 * @example S > A > B > C > D > E > F
	 */
	static compare(a: Grade, b: Grade) {
		return a.rank - b.rank;
	}

	static icompare(a: Grade, b: Grade) {
		return Grade.compare(b, a);
	}

	/**
	 * @returns All grades in order from S to F
	 */
	static getAll(): Grade[] {
		return Grade.helper.getAll().sort(Grade.icompare);
	}

	/**
	 * @returns All grades that support mining from S to F
	 */
	static getAllMining(): MiningGrade[] {
		return Array.from(Grade.supportsMining).sort((a, b) => Grade.compare(b, a));
	}

	static getAllRevenue() {
		return Array.from(Grade.supportsRevenue);
	}

	static getAllCombat() {
		return Array.from(Grade.supportsCombat);
	}

	static readonly F = new Grade('F', null,    null, 200, false) as RevenueGrade;
	static readonly E = new Grade('E', Grade.F, null, 300, false) as RevenueGrade;
	static readonly D = new Grade('D', Grade.E, null, 450, false) as RevenueGrade;
	static readonly C = new Grade('C', Grade.D, 250,  550, false) as
		MiningGrade & RevenueGrade;
	static readonly B = new Grade('B', Grade.C, 350,  650, true) as
		MiningGrade & RevenueGrade & CombatGrade;
	static readonly A = new Grade('A', Grade.B, 500,  750, true) as
		MiningGrade & RevenueGrade & CombatGrade;
	static readonly S = new Grade('S', Grade.A, null, 850, true) as
		RevenueGrade & CombatGrade;

	toString(): string {
		return this.letter;
	}
}