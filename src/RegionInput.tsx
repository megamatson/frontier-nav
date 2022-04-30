import _ from "lodash";
import React from "react";
import BasicProbe from "./BasicProbe";
import { Region, SiteId, SiteIdsOf } from "./Mira";
import NoProbe from "./NoProbe";
import Probe, { SightseeingNumber } from "./Probe";
import TableRowSiteInput, {
	Props as TableRowSiteInputProps
} from "./TableRowSiteInput";

export interface MutableSiteData {
	sightseeingSpots?: SightseeingNumber,
	probe?: Probe,
	newProbe?: Probe,
}

export type SiteData = {
	maxSightseeingSpots?: SightseeingNumber,
} & MutableSiteData

export type RegionDatum<T extends Region = Region> =
	Partial<Record<SiteIdsOf<T>, SiteData>> & {
		[siteId: string]: SiteData | undefined
	}
;


export type Props = {
	name: string,
	region: RegionDatum,

	settableProbes?: Set<Probe>,

	setData?(map: Map<SiteId, MutableSiteData>): void;
	disabled?: boolean;
} & Pick<TableRowSiteInputProps, 'hideProbeIfNotSettable'>;


export default class RegionInput extends React.PureComponent<Props> {
	render(): React.ReactNode {
		const probeSetter = !this.props.disabled && this.props.setData ?
			this.setProbe :
			undefined
		;

		const sightseeingSpotsSetter = !this.props.disabled && this.props.setData ?
			this.setSightseeingSpots :
			undefined
		;

		const hasNewProbes = _.some(this.props.region, siteData => {
			if (!_.isUndefined(siteData?.newProbe))
				return true;

			return false;
		});

		const rows = 	Object.keys(this.props.region).map(siteIdString => {
			const siteId = parseInt(siteIdString) as SiteId;
			const site = this.props.region[siteIdString]!;
			return <TableRowSiteInput
				siteId={siteId}
				key={siteId}
				sightseeingSpots={site.sightseeingSpots}
				maxSightseeingSpots={site.maxSightseeingSpots}
				probe={site.probe}
				newProbe={site.newProbe}
				settableProbes={this.props.settableProbes}
				emptyNewProbe={hasNewProbes}

				setProbe={probeSetter}
				setSightseeingSpots={sightseeingSpotsSetter}
				hideProbeIfNotSettable={this.props.hideProbeIfNotSettable}
			/>;
		});


		if (probeSetter) {
			rows.push(
				<tr key="set none">
					<td>All</td>
					<td>
						<button onClick={() => this.setAllProbes(NoProbe)}>
							{NoProbe.getName() + 's'}
						</button>
					</td>
					{
						hasNewProbes ?
							<td>
								<button onClick={this.clearNewProbes}>
									Clear New Probes
								</button>
							</td> :
							undefined
					}
					<td>
						<button onClick={this.zeroAllSightseeingSpots}>
							0 Sightseeing spots
						</button>
					</td>
				</tr>,
				<tr key="set all">
					<td>All</td>
					<td>
						<button onClick={() => this.setAllProbes(BasicProbe)}>
							{BasicProbe.getName() + 's'}
						</button>
					</td>
					{
						hasNewProbes ?
							<td>
								<button onClick={this.applyNewProbes}>Use New Probes</button>
							</td> :
							undefined
					}
					<td>
						<button onClick={this.maxAllSightseeingSpots}>
							Max Sightseeing Spots
						</button>
					</td>
				</tr>
			);
		}

		return <div className="region-input">
			<h1>{this.props.name}</h1>

			<table>
				<thead>
					<tr>
						<th>Site</th>
						<th>Probe</th>
						{hasNewProbes ? <th>New Probe</th> : null}
						<th>Sightseeing Spots</th>
					</tr>
				</thead>
				<tbody>{rows}</tbody>
			</table>
		</div>;
	}

	getAllSiteIds(this: this) {
		return Object.keys(this.props.region).map(id => parseInt(id) as SiteId);
	}

	getAllSites(this: this) {
		return this.getAllSiteIds().map(siteId =>
			[siteId, this.props.region[siteId]] as [SiteId, SiteData]
		);
	}

	applyNewProbes = () => {
		let map = new Map<SiteId, MutableSiteData>();

		Object.keys(this.props.region).forEach(siteIdString => {
			const siteId = parseInt(siteIdString) as SiteId;
			const site = this.props.region[siteIdString]!;

			const newProbe = site.newProbe;
			if (!newProbe)
				return {};

			map.set(siteId, {
				newProbe: undefined,
				probe: newProbe,
			});
		});

		this.props.setData!(map);
	};

	clearNewProbes = () => {
		console.log('Clear new probes');

		this.props.setData!(new Map(
			Object.keys(this.props.region).map(siteIdString => {
				const siteId = parseInt(siteIdString) as SiteId;
				return [siteId, {newProbe: NoProbe}];
			})
		));
	};

	setProbe = (siteId: SiteId, probe: Probe) => {
		const newProbe = this.props.region[siteId]!.newProbe;
		this.props.setData!(new Map([[siteId, {probe, newProbe}]]));
	};

	setSightseeingSpots = (siteId: SiteId, spots: SightseeingNumber) => {
		this.props.setData!(new Map([[siteId, {sightseeingSpots: spots}]]));
	};

	setAllProbes = (probe: Probe) => {
		this.props.setData!(new Map(this.getAllSiteIds().map(siteId =>
			[siteId, {probe}]
		)));
	};

	maxAllSightseeingSpots = () => {
		this.props.setData!(new Map(this.getAllSites().map(([siteId, site]) =>
			[siteId, {sightseeingSpots: site.maxSightseeingSpots}]
		)));
	};

	zeroAllSightseeingSpots = () => {
		this.props.setData!(new Map(
			this.getAllSites()
				.filter(([_, site]) => site.maxSightseeingSpots)
				.map(([siteId]) =>
					[siteId, {sightseeingSpots: 0}]
				)
		));
	};
}