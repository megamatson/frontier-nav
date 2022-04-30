import produce, { enableMapSet } from 'immer';
import React from 'react';
import AllSiteInfoInput, {
	Props as AllSiteInfoInputProps,
	SiteData
} from './AllSiteInfoInput';
import './App.css';
import Mira, { Region, SiteId } from './Mira';
import './ProbeGameOrder';
import NoProbe from './NoProbe';
import OutputComponent from './OutputComponent';
import Probe, { SightseeingNumber } from './Probe';
import ProbeCountInput, {Props as ProbeInputProps} from './ProbeCountInput';
import Site from './Site';
import BasicProbe from './BasicProbe';
import _ from 'lodash';
import FitnessFunctionInput, {
	FitnessFunctionParameters,
	getFitnessFunction,
	Props as FitnessFunctionProps
} from './FitnessFunctionInput';
import { FitnessFunction } from './FitnessFunction';
import SolutionGenerator from './SolutionGenerator';
import Output from './Output';

enableMapSet();

type Regions = NonNullable<AllSiteInfoInputProps['regions']>;


export interface State {
	probes: Map<Probe, number>;
	regions: Regions;
	fitnessFunctionParameters: FitnessFunctionParameters;
	fitnessFunction: FitnessFunction;
	findingSolution: boolean;
}

function getProbeCount(state: State) {
	const ret: ProbeInputProps['probes'] = new Map();

	state.probes.forEach((max, probe) => {
		ret.set(probe, {max});
	});

	for (const regionName in state.regions) {
		const region = state.regions[regionName as keyof typeof state.regions];

		for (const siteString in region) {
			const site = region[siteString]!;
			const probe = site.probe ?? NoProbe;

			let data = ret.get(probe);
			if (data === undefined) {
				console.log(probe.getName());
				data = { max: 0 };
				ret.set(probe, data);
			}

			data as NonNullable<typeof data>;
			if (data.number === undefined)
				data.number = 0;

			data.number++;
		}
	}

	return ret;
}


class App extends React.PureComponent<{}, State> {
	mira = new Mira();

	constructor(props: any) {
		super(props);
		this.state = this.getInitialState();

		for (const regionName of Mira.getRegionNames()) {
			const region = this.mira[regionName];

			for (const site of region.getSites()) {
				const siteData = this.getSiteData(site.id);
				site.probe = siteData.probe ?? NoProbe;
				site.setSightseeingSpots(siteData.sightseeingSpots ?? 0);
			}
		}
	}

	getSiteData(this: this, id: SiteId): SiteData;
	getSiteData(this: this, id: number|string): SiteData | undefined {
		for (const region of Mira.getRegionNames()) {
			const ret = this.state?.regions?.[region]?.[id];

			if (ret !== undefined)
				return ret;
		}

		return undefined;
	}

	getRegion(
		this: this,
		id: SiteId
	): keyof Required<Regions> | undefined {
		const regions: (keyof NonNullable<State['regions']>)[] = [
			'Primordia',
			'Noctilum',
			'Oblivia',
			'Sylvalum',
			'Cauldros',
		];

		for (const region of regions) {
			const miraRegion = this.mira[region as keyof Mira];
			if (miraRegion instanceof Region && (miraRegion as any)[id] !== undefined)
				return region;
		}

		return undefined;
	}

	componentDidUpdate() {
		this.updateUrl(this.state);
	}



	getQueryFromState(state: State): string {
		let query = new URLSearchParams();
		this.setQueryFromRegions(state.regions, query);
		this.setQueryFromProbes(state.probes, query);
		this.setQueryFromFitnessParameters(state.fitnessFunctionParameters, query);

		let ret = query.toString();
		if (!ret.startsWith('?'))
			ret = '?' + ret;
		return ret;
	}

	setQueryFromProbes(probes: Map<Probe, number>, query: URLSearchParams) {
		probes.forEach((max, probe) => {
			if (probe === BasicProbe || probe === NoProbe) {
				if (max !== Infinity)
					query.set(probe.getName(), max.toString());
			} else if (max !== 0)
				query.set(probe.getName(), max.toString());
		});
	}

	setQueryFromRegions(
		regions: State['regions'],
		query: URLSearchParams
	) {
		for (const regionName in regions) {
			const region = regions[regionName as keyof typeof regions];
			for (const siteId in region) {
				const siteData = region[siteId];
				if (siteData === undefined)
					continue;

				const {probe, sightseeingSpots} = siteData;

				if (probe && probe !== NoProbe)
					query.set(siteId + '_p', probe.getName());

				if (sightseeingSpots)
					query.set(siteId + '_s', sightseeingSpots.toString());
			}
		}
	}

	private static readonly defaultFitnessParameters:
		Record<keyof State['fitnessFunctionParameters'], number> =
	{
		'storageToMiranium': 2,
		'targetCredits': Infinity,
		'targetStorage': 6000,
	} as const;

	private static readonly fitnessFunctionParametersPrefix = 'FF_';

	setQueryFromFitnessParameters(
		params: State['fitnessFunctionParameters'],
		query: URLSearchParams
	) {
		_.forOwn(params, (value, param) => {
			if (!param)
				return;

			const key = param as keyof State['fitnessFunctionParameters'];
			const default_ = App.defaultFitnessParameters[key];

			if (value !== default_)
				query.set(App.fitnessFunctionParametersPrefix + key, value.toString());
		});
	}

	updateUrl(state: State) {
		window.history.replaceState({}, '', this.getQueryFromState(state));
	}

	getStateFromQuery(query = window.location.search): State {
		const querySearcher = new URLSearchParams(query);
		const fitnessFunctionParameters = this.getInitialFitnessParameters(
			querySearcher
		);

		return {
			probes: this.getInitialProbes(querySearcher),
			regions: this.getInitialRegions(querySearcher),
			findingSolution: false,
			fitnessFunctionParameters,
			fitnessFunction: getFitnessFunction(fitnessFunctionParameters),
		};
	}

	getInitialFitnessParameters(
		query: URLSearchParams
	): State['fitnessFunctionParameters'] {

		let ret: {[p: string]: number} = {};

		_.forOwn(App.defaultFitnessParameters, (default_, key) => {
			const param = query.get(App.fitnessFunctionParametersPrefix + key);

			ret[key] = param === null ? default_ : parseFloat(param);
		});

		return ret as unknown as State['fitnessFunctionParameters'];
	}

	getInitialRegions(query: URLSearchParams): State['regions'] {
		const ret: State['regions'] = {
			Primordia: {},
			Noctilum: {},
			Oblivia: {},
			Sylvalum: {},
			Cauldros: {},
		};

		for (const miraRegion of this.mira.getRegions()) {
			const regionName = miraRegion.getName() as keyof State['regions'];
			const region = ret[regionName];
			for (const site of miraRegion.getSites()) {
				const siteId = site.id;

				const maxSightseeingSpots = site.maxSightSeeingSpots;
				const probe = Probe.get(query.get(siteId + '_p')?.replace('+', ' '));
				let sightseeingSpots = _.clamp(
					parseInt(query.get(siteId + '_s') || '0') || 0,
					0,
					maxSightseeingSpots
				) as SightseeingNumber;

				if (!_.isInteger(sightseeingSpots))
					sightseeingSpots = Math.round(sightseeingSpots) as SightseeingNumber;

				region![siteId] = {
					maxSightseeingSpots,
					probe,
					sightseeingSpots
				};
			}
		}

		return ret;
	}

	getInitialProbes(query: URLSearchParams): State['probes'] {
		return new Map(
			Array.from(Probe.getAll()).map(probe =>
				[
					probe,
					probe !== BasicProbe && probe !== NoProbe ?
						parseInt(query.get(probe.getName()) || '0') :
						Infinity
				]
			)
		);
	}

	getInitialState(): State {
		return this.getStateFromQuery();
	}


	hasNewSolution(this: this): boolean {
		let ret = false;
		_.forOwn(this.state.regions, region => {
			if (!region)
				return;

			_.forOwn(region, site => {
				if (site?.newProbe) {
					ret = true;
					return false;
				}
			});

			if (ret)
				return false;
		});

		return ret;
	}


	render(this: this): React.ReactNode {
		const output = this.mira.getOutput();
		const fitness = this.state.fitnessFunction?.(output);
		const probeCount = getProbeCount(this.state);

		const style: React.CSSProperties = {
			float: 'left',
		};

		const settableProbes = new Set<Probe>();
		probeCount.forEach(({max, number}, probe) => {
			number = number ?? 0;
			max = max ?? 0;
			if (number < max)
				settableProbes.add(probe);
		});

		const hasNewSolution = this.hasNewSolution();

		let newOutput: Output | undefined, newFitness: number | undefined;

		if (hasNewSolution) {
			newOutput = this.getProposedOutput();
			newFitness = this.state.fitnessFunction?.(newOutput);
		}

		return <div style={{
			display: 'flex',
			flexWrap: 'wrap'
		}}>
			<div style={style}>
				<div>
					<button
						onClick={() => this.setData(new Map(
							Array.from(this.mira.getSites()).map(
								site => [site.id, {probe: BasicProbe}]
							)
						))}
						disabled={this.state.findingSolution}
					>
						All Basic Probes
					</button>
					<button
						onClick={() => this.setData(new Map(
							Array.from(this.mira.getSites()).map(
								site => [site.id, {probe: NoProbe}]
							)
						))}
						disabled={this.state.findingSolution}
					>
						All No Probes
					</button>
					<FitnessFunctionInput
						setData={this.setFitenessParameters}
						disabled={this.state.findingSolution}
						{...this.state.fitnessFunctionParameters}
					/>
					<button
						onClick={this.findSolution}
						disabled={this.state.findingSolution}
					>
						{
							this.state.findingSolution ?
								'Finding Solution...' :
								'Find Solution'
						}
					</button>
					{
						hasNewSolution ?
							<button
								onClick={this.useNewSolution}
								disabled={this.state.findingSolution}
							>
								Use Solution
							</button> :
							undefined
					}
				</div>
				<OutputComponent
					current={{...output, fitness}}
					new={{...newOutput, fitness: newFitness }}
				/>
			</div>
			<div style={style}>
				<ProbeCountInput
					probes={probeCount}
					setProbesMax={this.setProbesMax}
					disabled={this.state.findingSolution}
				/>
				<div/>
			</div>
			<AllSiteInfoInput
				setSiteData={this.setData}
				regions={this.state.regions}
				settableProbes={settableProbes}
				hideProbeIfNotSettable={true}
				style={style}
				disabled={this.state.findingSolution}
			/>
		</div>;
	}

	setFitenessParameters: NonNullable<FitnessFunctionProps['setData']> = data =>
	{
		this.setState(produce<State>(draft => {
			if (data.fitnessFunction)
				draft.fitnessFunction = data.fitnessFunction;

			_.forOwn(data, (param, potentialKey) => {
				if (
					!param ||
					draft.fitnessFunctionParameters[
						potentialKey as keyof typeof draft.fitnessFunctionParameters
					] === undefined
				)
					return;

				const key = potentialKey as
					keyof (typeof draft)['fitnessFunctionParameters']
					& keyof typeof data
				;
				const datum = data[key];

				if (datum !== undefined)
					draft.fitnessFunctionParameters[key] = datum;
			});
		}));
	};

	setData: NonNullable<AllSiteInfoInputProps['setSiteData']> = map => {
		this.setState(produce<State>(draft => {
			map.forEach((siteData, siteId) => {
				if (draft.regions === undefined)
					draft.regions = {};

				const region = this.getRegion(siteId);
				if (region === undefined)
					throw new Error(`Region was undefined for ${siteId}`);

				const {probe, sightseeingSpots, newProbe} = siteData;

				if (!probe && sightseeingSpots === undefined && !newProbe)
					return;

				const site = (this.mira as any)[region][siteId] as Site;
				const stateSite = draft.regions[region]![siteId]!;

				if (probe) {
					if (probe !== site.probe) {
						site.probe = probe;
						stateSite.probe = probe;
					}

					if (stateSite.newProbe === probe)
						delete stateSite.newProbe;
				}

				if (sightseeingSpots !== undefined) {
					site.setSightseeingSpots(sightseeingSpots);
					stateSite.sightseeingSpots = sightseeingSpots;
				}

				if (newProbe === NoProbe)
					delete stateSite.newProbe;
				else if (newProbe && newProbe !== site.probe)
					stateSite.newProbe = newProbe;
			});
		}));
	};

	setProbesMax = (map: Map<Probe, number>) => {
		this.setState(produce<State>(draft => {
			map.forEach((newMax, probe) => {
				draft.probes.set(probe, newMax);
			});
		}));
	};

	setFitnessFunction = (f: FitnessFunction) => {
		this.setState(produce<State>(draft => {
			draft.fitnessFunction = f;
		}));
	};

	useNewSolution = () => {
		let data: Parameters<typeof this.setData>[0] = new Map();

		_.forOwn(this.state.regions, region => {
			if (!region)
				return;

			_.forOwn(region, (site, siteIdString) => {
				const siteId = parseInt(siteIdString) as SiteId;

				if (site?.newProbe)
					data.set(siteId, {
						newProbe: NoProbe,
						probe: site.newProbe
					});
			});
		});

		this.setData(data);
	};

	getProposedOutput() {
		const proposedMira = this.mira.clone();

		_.forOwn(this.state.regions, region => {
			if (!region)
				return;

			_.forOwn(region, (site, siteId) => {
				if (!site || !site.newProbe)
					return;

				proposedMira.get(siteId).probe = site.newProbe;
			});
		});

		return proposedMira.getOutput();
	}

	setNewSolution = (solution: Mira) => {
		let data: Parameters<typeof this.setData>[0] = new Map();

		for (const site of solution.getSites())
			data.set(site.id, {newProbe: site.probe});

		this.setData(data);
	};

	findSolution = async () => {
		let data: Parameters<typeof this.setData>[0] = new Map();
		let shouldReturn = false;
		this.setState(produce<State>(draft => {
			if (draft.findingSolution) {
				console.log('already finding a solution');
				shouldReturn = true;
				return;
			}
			draft.findingSolution = true;

			_.forOwn(draft.regions, region => {
				if (region)
					_.forOwn(region, (_1, siteIdString) => {
						const siteId = parseInt(siteIdString) as SiteId;
						if (_.isNaN(siteId)) {
							console.log(`Unknown siteId: ${siteIdString}`);
							return;
						}
						data.set(siteId, {newProbe: NoProbe});
					});
			});
		}));
		this.setData(data);

		if (shouldReturn)
			return;

		if (this.state.fitnessFunction === undefined) {
			console.log('No fitness function');
			return;
		}

		const solutionGenerator = new SolutionGenerator(
			this.mira,
			this.state.probes,
			this.state.fitnessFunction,
			{totalIterations: 100}
		);

		solutionGenerator.addEventListener('better solution', cb => {
			// this.setNewSolution((cb as any).detail as Mira);
		});

		const solutionPromise = solutionGenerator.getOptimizedSolution();
		const solution = await solutionPromise;
		this.setNewSolution(solution);

		this.setState(produce(draft => {
			if (!draft.findingSolution)
				console.error('ERROR: finding solution was false!');
			draft.findingSolution = false;
		}));
	};
}

export default App;
