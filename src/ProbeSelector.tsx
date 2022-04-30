import React from "react";
import Probe from "./Probe";
import "./ProbeGameOrder";
import NoProbe from "./NoProbe";

export interface Props {
	currentProbe?: Probe,
	setProbe?(probe: Probe): void;
	settableProbes?: Set<Probe>;
	hideProbeIfNotSettable?: boolean;
}

export default class ProbeSelector extends React.Component<Props> {
	isDisabled(probe: Probe): boolean {
		if (probe === this.props.currentProbe)
			return false;

		if (!this.props.settableProbes)
			return false;

		return !this.props.settableProbes.has(probe);
	}

	private static readonly probeList = Probe.getAll();

	render(): React.ReactNode {
		let probeList = ProbeSelector.probeList;

		if (this.props.hideProbeIfNotSettable)
			probeList = probeList.filter(probe =>
				!this.isDisabled(probe)
			);

		if (this.props.setProbe)
			return <select
				onChange={this.handleChange}
				value={(this.props.currentProbe ?? NoProbe).getName()}
			>
				{
					probeList.map(probe =>
						<option
							key={probe.getName()}
							disabled={this.isDisabled(probe)}
						>
							{
								probe.getName()
							}
						</option>
					)
				}</select>
			;

		return (this.props.currentProbe ?? NoProbe).getName();
	}

	handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		this.props.setProbe?.(Probe.get(e.target.value));
	};
}