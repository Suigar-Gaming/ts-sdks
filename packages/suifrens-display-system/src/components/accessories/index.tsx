import { AnimatedAccessory } from '../../animation/AnimatedAccessory.js';
import type { AnimationPart } from '../../animation/parts.js';
import type { AccessoryMetadata, SuiFrenSpecies } from '../../utils/accessoryUtils.js';
import type { AccessoryRenderer, BodyAccessoryProps } from './AccessorySlot.js';
import { SuperHeroCape } from './back/SuperHeroCape.js';
import { Wings } from './back/Wings.js';
import { Apron } from './body/Apron.js';
import { Cardigan } from './body/Cardigan.js';
import { LeatherJacket } from './body/LeatherJacket.js';
import { Vest } from './body/Vest.js';
import { WizardRobe } from './body/WizardRobe.js';
import { getVipCrownAssetSrc, getVipCrownAssetViewport } from './crownAssets.js';
import { Glasses8Bit } from './eyes/Glasses8Bit.js';
import { GlassesY2K } from './eyes/GlassesY2k.js';
import { SuperHeroMask } from './eyes/SuperHeroMask.js';
import { BlueSlipons } from './feet/BlueSlipons.js';
import { Boots } from './feet/Boots.js';
import { CasualShoes } from './feet/CasualShoes.js';
import { DressShoes } from './feet/DressShoes.js';
import { GothBoots } from './feet/GothBoots.js';
import { PinkSlipons } from './feet/PinkSlipons.js';
import { RockStarBoots } from './feet/RockStarBoots.js';
import { SaddleShoes } from './feet/SaddleShoes.js';
import { Sneakers } from './feet/Sneakers.js';
import { WitchBoots } from './feet/WitchBoots.js';
import { BaseballCap } from './head/BaseballCap.js';
import { Beanie } from './head/Beanie.js';
import { Beret } from './head/Beret.js';
import { BlondeWig } from './head/BlondeWig.js';
import { BowlerHat } from './head/BowlerHat.js';
import { CowboyHat } from './head/CowboyHat.js';
import { CurlyWig } from './head/CurlyWig.js';
import { HairBow } from './head/HairBow.js';
import { Halo } from './head/Halo.js';
import { Mohawk } from './head/Mohawk.js';
import { SantaHat } from './head/SantaHat.js';
import { Snorkel } from './head/Snorkel.js';
import { WizardHat } from './head/WizardHat.js';
import { XRGoggles } from './head/XRGoggles.js';
import { BellBottoms } from './legs/BellBottoms.js';
import { BlueJeans } from './legs/BlueJeans.js';
import { BusinessSlacks } from './legs/BusinessSlacks.js';
import { Cutoffs } from './legs/Cutoffs.js';
import { PunkSkirt } from './legs/PunkSkirt.js';
import { RockStarRuffle } from './legs/RockStarRuffle.js';
import { SoccerTeamSwimTrunks } from './legs/SoccerTeamSwimTrunks.js';
import { SuperHeroStars } from './legs/SuperHeroStars.js';
import { SwimTrunks } from './legs/SwimTrunks.js';
import { WhitePants } from './legs/WhitePants.js';
import { Brush } from './objects/Brush.js';
import { Lasso } from './objects/Lasso.js';
import { MagicWand } from './objects/MagicWand.js';
import { Microphone } from './objects/Microphone.js';
import { Palette } from './objects/Palette.js';
import { Pencil } from './objects/Pencil.js';
import { RunnerAccessory } from './runnerKit.js';
import { resolveSoccerCountryCode, resolveSoccerTeamSide } from './soccerTeamKit.js';
import { SvgAccessory } from './SvgAccessory.js';
import { BussinessShirt } from './torso/BusinessShirt.js';
import { CowboyShirt } from './torso/CowboyShirt.js';
import { HeartShirt } from './torso/HeartShirt.js';
import { Lifeguard } from './torso/Lifeguard.js';
import { SkullShirt } from './torso/SkullShirt.js';
import { SoccerTeamShirt } from './torso/SoccerTeamShirt.js';
import { StripeShirt } from './torso/StripeShirt.js';
import { Swimsuit } from './torso/Swimsuit.js';

export type { BodyAccessoryProps } from './AccessorySlot.js';

const TYPE_FALLBACK: Partial<Record<string, AnimationPart>> = {
	head: 'head',
	eyes: 'head',
	body: 'body',
	torso: 'body',
	back: 'body',
	object: 'leftArm',
	legs: 'body',
	feet: 'rightLeg',
};

const NAME_SPECIFIC_FALLBACK: Partial<Record<string, AnimationPart>> = {
	wings: 'body',
	'superhero cape': 'body',
};

function resolveFallbackPart(
	accessory: Pick<AccessoryMetadata, 'name' | 'type'>,
): AnimationPart | undefined {
	const { name, type } = accessory;
	const specific = NAME_SPECIFIC_FALLBACK[name];
	if (specific) {
		return specific;
	}
	return TYPE_FALLBACK[type];
}

function resolveAssetSrc(accessory: AccessoryMetadata) {
	return (
		accessory.renderOptions.assetSrc ??
		(accessory.category === 'crowns' ? getVipCrownAssetSrc(accessory.name) : undefined)
	);
}

type AccessoryProps = BodyAccessoryProps & {
	accessory: AccessoryMetadata;
	species: SuiFrenSpecies;
};

export const ACCESSORY_RENDERERS: Record<string, AccessoryRenderer> = {
	'runner singlet': (props) => <RunnerAccessory {...props} />,
	'runner shorts': (props) => <RunnerAccessory {...props} />,
	'runner headband': (props) => <RunnerAccessory {...props} />,
	'runner shoes': (props) => <RunnerAccessory {...props} />,
	'8 bit glasses': () => <Glasses8Bit />,
	apron: (props) => <Apron body={props.body} />,
	'baseball cap': () => <BaseballCap />,
	beanie: () => <Beanie />,
	beret: () => <Beret />,
	'blonde wig': () => <BlondeWig />,
	'curly wig': () => <CurlyWig />,
	boots: () => <Boots />,
	brush: () => <Brush />,
	'bug eyes': () => <GlassesY2K />,
	'business shirt': (props) => <BussinessShirt lor={props.lor} body={props.body} />,
	'business slacks': () => <BusinessSlacks />,
	cardigan: (props) => <Cardigan lor={props.lor} body={props.body} />,
	'casual shoes': () => <CasualShoes />,
	'cowboy hat': () => <CowboyHat />,
	'cowboy shirt': (props) => <CowboyShirt lor={props.lor} body={props.body} />,
	cutoffs: () => <Cutoffs />,
	'dress shoes': () => <DressShoes />,
	'goth boots': () => <GothBoots />,
	'left goth boot': () => <GothBoots side="left" />,
	'right goth boot': () => <GothBoots side="right" />,
	halo: () => <Halo />,
	'hair bow': () => <HairBow />,
	'heart shirt': (props) => <HeartShirt lor={props.lor} body={props.body} />,
	lasso: () => <Lasso />,
	'leather jacket': (props) => <LeatherJacket lor={props.lor} body={props.body} />,
	lifeguard: (props) => <Lifeguard lor={props.lor} body={props.body} />,
	'magic wand': () => <MagicWand />,
	microphone: () => <Microphone />,
	mohawk: () => <Mohawk />,
	palette: () => <Palette />,
	pencil: () => <Pencil />,
	'pink slip ons': () => <PinkSlipons />,
	'punk skirt': () => <PunkSkirt />,
	'rock star boots': () => <RockStarBoots />,
	'rock star ruffle': () => <RockStarRuffle />,
	'saddle shoes': () => <SaddleShoes />,
	'santa hat': () => <SantaHat />,
	sneakers: () => <Sneakers />,
	snorkel: () => <Snorkel />,
	'soccer team shirt': (props) => (
		<SoccerTeamShirt
			lor={props.lor}
			body={props.body}
			country={
				props.accessory.renderOptions.teamKit ??
				resolveSoccerCountryCode(props.accessory.renderOptions.country)
			}
			side={resolveSoccerTeamSide(props.accessory.renderOptions.side)}
		/>
	),
	'soccer team swim trunks': (props) => (
		<SoccerTeamSwimTrunks
			body={props.body}
			country={
				props.accessory.renderOptions.teamKit ??
				resolveSoccerCountryCode(props.accessory.renderOptions.country)
			}
			side={resolveSoccerTeamSide(props.accessory.renderOptions.side)}
		/>
	),
	'skull shirt': (props) => <SkullShirt lor={props.lor} body={props.body} />,
	'stripe shirt': (props) => <StripeShirt lor={props.lor} body={props.body} />,
	'superhero cape': () => <SuperHeroCape />,
	'superhero mask': () => <SuperHeroMask />,
	'superhero stars': () => <SuperHeroStars />,
	swimsuit: (props) => <Swimsuit body={props.body} />,
	'swim trunks': () => <SwimTrunks />,
	vest: (props) => <Vest body={props.body} />,
	'white pants': () => <WhitePants />,
	wings: (props) => <Wings lor={props.lor} />,
	'witch boots': () => <WitchBoots />,
	'wizard hat': () => <WizardHat />,
	'wizard robe': (props) => <WizardRobe lor={props.lor} body={props.body} />,
	'xr goggles': () => <XRGoggles />,
	'blue jeans': () => <BlueJeans />,
	'bell bottoms': () => <BellBottoms />,
	'bowler hat': () => <BowlerHat />,
	'blue slip ons': () => <BlueSlipons />,
};

export function InlineAccessory(props: AccessoryProps) {
	const renderer = ACCESSORY_RENDERERS[props.accessory.name];
	const assetSrc = resolveAssetSrc(props.accessory);
	const fallbackPart =
		props.accessory.renderOptions.animationPart ?? resolveFallbackPart(props.accessory);

	if (!renderer && !assetSrc) {
		return null;
	}

	const renderedAccessory = renderer ? (
		renderer(props)
	) : assetSrc ? (
		<SvgAccessory
			assetSrc={assetSrc}
			viewport={getVipCrownAssetViewport(assetSrc)}
			species={props.species}
			placement={props.accessory.renderOptions.placement}
		/>
	) : null;

	if (!renderedAccessory) {
		return null;
	}

	return <AnimatedAccessory fallbackPart={fallbackPart}>{renderedAccessory}</AnimatedAccessory>;
}

export const Accessory = InlineAccessory;
