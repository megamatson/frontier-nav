import React from "react";
import { ReactNode } from "react";
import { SiteId } from "./Mira";
import Probe, { SightseeingNumber } from "./Probe";
import ProbeSelector, {Props as ProbeSelectorProps} from "./ProbeSelector";
import SightseeingSpotsInput from "./SightseeingSpotsInput";


interface SiteInputProps {
	siteId: SiteId,
	probe?: Probe,
	newProbe?: Probe,
	emptyNewProbe?: boolean,
	maxSightseeingSpots?: SightseeingNumber,
	sightseeingSpots?: SightseeingNumber,

	settableProbes?: Set<Probe>;

	setProbe?(siteId: SiteId, probe: Probe): void;
	setSightseeingSpots?(
		siteId: SiteId,
		sightseeingSpots: SightseeingNumber
	): void;
}

type TableRowSiteInputProps = Pick<
	ProbeSelectorProps,
	'hideProbeIfNotSettable'
>;
export type Props = SiteInputProps & TableRowSiteInputProps;


export default class TableRowSiteInput extends React.Component<Props>
{
	render(): ReactNode {
		const sightseeingSpotsSetter = this.props.setSightseeingSpots ?
			(sightseeingSpots: SightseeingNumber) =>
				this.props.setSightseeingSpots!(this.props.siteId, sightseeingSpots) :
			undefined
		;

		const probeSetter = this.props.setProbe ?
			(probe: Probe) =>
				this.props.setProbe!(this.props.siteId, probe) :
			undefined
		;

		return <tr>
			<td>
				{this.props.siteId}
			</td>
			<td>
				<ProbeSelector
					currentProbe={this.props.probe}
					setProbe={probeSetter}
					settableProbes={this.props.settableProbes}
					hideProbeIfNotSettable={this.props.hideProbeIfNotSettable}
				/>
			</td>
			{
				this.props.newProbe ?
					probeSetter ?
						<td><button
							onClick={() => probeSetter(this.props.newProbe!)}
						>{this.props.newProbe.getName()}</button></td> :
						<td>{this.props.newProbe.getName()}</td> :
					(this.props.emptyNewProbe ? <td></td>: null)
			}
			<td>
				<SightseeingSpotsInput
					maxSightseeingSpots={this.props.maxSightseeingSpots}
					sightseeingSpots={this.props.sightseeingSpots}
					setSightseeingSpots={sightseeingSpotsSetter}
				/>
			</td>
		</tr>;
	}
}