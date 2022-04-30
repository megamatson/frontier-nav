import Grade from "./Grade";
import { SiteId } from "./Mira";
import Output from "./Output";
import Site from "./Site";

test('No Probe', () => {
	let emptySite = new Site({
		id: 0 as SiteId,
		combat: Grade.S,
		production: Grade.A,
		revenue: Grade.A,
	});

	expect(emptySite.getOutput(new Map(), new Map())).toEqual(new Output());
});
