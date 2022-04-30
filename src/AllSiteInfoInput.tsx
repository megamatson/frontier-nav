import React, { ReactNode } from "react";
import Mira from "./Mira";
import * as mira from "./Mira";
import RegionInput, {
	MutableSiteData,
	RegionDatum,
	Props as RegionInputProps
} from "./RegionInput";

export type SiteData = MutableSiteData

export type RegionData = Partial<{
	[
		K in keyof Mira as Mira[K] extends mira.Region ? K : never
	]: Mira[K] extends mira.Region ? RegionDatum<Mira[K]> : never
}>

export type Props = {
	regions?: RegionData,
	setSiteData?(map: Map<mira.SiteId, Partial<SiteData>>): void,
	style?: React.CSSProperties,
	settableProbes?: RegionInputProps['settableProbes'],
} & Pick<RegionInputProps, 'hideProbeIfNotSettable'|'disabled'>


export default class AllSiteInfoInput extends React.PureComponent<Props> {
	render(): ReactNode {
		return <>{
			Array.from(Mira.getRegionNames()).map(regionName => {
				const region = this.props?.regions?.[regionName];

				return region ?
					<div key={regionName} style={this.props.style}>
						<RegionInput
							name={regionName}
							region={region}

							settableProbes={this.props.settableProbes}
							hideProbeIfNotSettable={this.props.hideProbeIfNotSettable}

							setData={this.props.setSiteData}
							disabled={this.props.disabled}
						/>
					</div> :
					undefined
				;
			})
		}</>;
	}
}