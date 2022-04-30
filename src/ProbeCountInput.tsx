import React from "react";
import "./ProbeGameOrder";
import BasicProbe from "./BasicProbe";
import NoProbe from "./NoProbe";
import Probe from "./Probe";
import QuantityMaxInput from "./QuantityMaxInput";

export interface ProbeData {
	number?: number,
	max: number,
}

export interface Props {
	probes: Map<Probe, ProbeData>,
	setProbesMax?(data: Map<Probe, number>): void,
	disabled?: boolean
}

export default class ProbeCountInput extends React.Component<Props> {
	render(): React.ReactNode {
		return this.errors() || <table>
			<thead>
				<tr>
					<th>Probe</th>
					<th>Number</th>
				</tr>
			</thead>
			<tbody>
				{
					Probe.getAll().map(probe => <tr key={probe.getName()}>
						<td>
							{probe.getName()}
						</td>
						<td>
							<QuantityMaxInput
								{...this.props.probes.get(probe)}
								setMax={
									!this.props.disabled
										&& this.props.setProbesMax
										&& !ProbeCountInput.unlimitedProbes.includes(probe) ?
										(n) => this.props.setProbesMax!(new Map([[probe, n]])) :
										undefined
								}
							/>
						</td>
					</tr>).concat(!this.props.disabled && this.props.setProbesMax ? [
						<tr key="reset">
							<td>All</td>
							<td>
								<button onClick={this.reset}>
									Reset All
								</button>
							</td>
						</tr>
					] : [])
				}
			</tbody>
		</table>;
	}

	private static readonly unlimitedProbes: Probe[] = [NoProbe, BasicProbe];

	private errors() {
		const probes = this.props.probes;

		const children: React.ReactElement[] = [];

		const addError = (probe: Probe, s: string) => {
			children.push(<p key={children.length}>ERROR: {probe.getName()} {s}</p>);
		};

		for (const probe of ProbeCountInput.unlimitedProbes) {
			const data = probes.get(probe);
			if (data && data.max !== Infinity)
				addError(probe, 'should have Infinity for max');
		}

		for (const probe of Probe.getAll()) {
			if (ProbeCountInput.unlimitedProbes.includes(probe))
				continue;

			const data = probes.get(probe);
			if (!data || data.max === undefined)
				addError(probe, 'should have a max.');
			else if (data.max < 0)
				addError(probe, 'should have a non-negative max');
		}

		if (children.length)
			return <>{children}</>;
	}

	reset = () => {
		this.props.setProbesMax?.(new Map(
			Probe.getAll()
				.filter(probe => !ProbeCountInput.unlimitedProbes.includes(probe))
				.map(probe => [probe, 0])
		));
	};
}