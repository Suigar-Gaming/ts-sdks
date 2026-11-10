import asset8BitGlasses from './accessory-assets/8-bit-glasses.svg';
import apron from './accessory-assets/apron.svg';
import baseballCap from './accessory-assets/baseball-cap.svg';
import beanie from './accessory-assets/beanie.svg';
import bellBottoms from './accessory-assets/bell-bottoms.svg';
import beret from './accessory-assets/beret.svg';
import blondeWig from './accessory-assets/blonde-wig.svg';
import blueJeans from './accessory-assets/blue-jeans.svg';
import blueSlipOns from './accessory-assets/blue-slip-ons.svg';
import boots from './accessory-assets/boots.svg';
import bowlerHat from './accessory-assets/bowler-hat.svg';
import brush from './accessory-assets/brush.svg';
import bugEyes from './accessory-assets/bug-eyes.svg';
import businessShirt from './accessory-assets/business-shirt.svg';
import businessSlacks from './accessory-assets/business-slacks.svg';
import cardigan from './accessory-assets/cardigan.svg';
import casualShoes from './accessory-assets/casual-shoes.svg';
import cowboyHat from './accessory-assets/cowboy-hat.svg';
import cowboyShirt from './accessory-assets/cowboy-shirt.svg';
import curlyWig from './accessory-assets/curly-wig.svg';
import cutoffs from './accessory-assets/cutoffs.svg';
import dressShoes from './accessory-assets/dress-shoes.svg';
import gothBoots from './accessory-assets/goth-boots.svg';
import hairBow from './accessory-assets/hair-bow.svg';
import halo from './accessory-assets/halo.svg';
import heartShirt from './accessory-assets/heart-shirt.svg';
import lasso from './accessory-assets/lasso.svg';
import leatherJacket from './accessory-assets/leather-jacket.svg';
import leftGothBoot from './accessory-assets/left-goth-boot.svg';
import lifeguard from './accessory-assets/lifeguard.svg';
import magicWand from './accessory-assets/magic-wand.svg';
import microphone from './accessory-assets/microphone.svg';
import mohawk from './accessory-assets/mohawk.svg';
import palette from './accessory-assets/palette.svg';
import pencil from './accessory-assets/pencil.svg';
import pinkSlipOns from './accessory-assets/pink-slip-ons.svg';
import punkSkirt from './accessory-assets/punk-skirt.svg';
import rightGothBoot from './accessory-assets/right-goth-boot.svg';
import rockStarBoots from './accessory-assets/rock-star-boots.svg';
import rockStarRuffle from './accessory-assets/rock-star-ruffle.svg';
import runnerHeadband from './accessory-assets/runner-headband.svg';
import runnerShoes from './accessory-assets/runner-shoes.svg';
import runnerShorts from './accessory-assets/runner-shorts.svg';
import runnerSinglet from './accessory-assets/runner-singlet.svg';
import saddleShoes from './accessory-assets/saddle-shoes.svg';
import santaHat from './accessory-assets/santa-hat.svg';
import skullShirt from './accessory-assets/skull-shirt.svg';
import sneakers from './accessory-assets/sneakers.svg';
import snorkel from './accessory-assets/snorkel.svg';
import soccerTeamShirt from './accessory-assets/soccer-team-shirt.svg';
import soccerTeamSwimTrunks from './accessory-assets/soccer-team-swim-trunks.svg';
import stripeShirt from './accessory-assets/stripe-shirt.svg';
import superheroCape from './accessory-assets/superhero-cape.svg';
import superheroMask from './accessory-assets/superhero-mask.svg';
import superheroStars from './accessory-assets/superhero-stars.svg';
import swimTrunks from './accessory-assets/swim-trunks.svg';
import swimsuit from './accessory-assets/swimsuit.svg';
import vest from './accessory-assets/vest.svg';
import whitePants from './accessory-assets/white-pants.svg';
import wings from './accessory-assets/wings.svg';
import witchBoots from './accessory-assets/witch-boots.svg';
import wizardHat from './accessory-assets/wizard-hat.svg';
import wizardRobe from './accessory-assets/wizard-robe.svg';
import xrGoggles from './accessory-assets/xr-goggles.svg';

export const SPLIT_LIMB_ASSET_NAMES = new Set<string>([
	'bell bottoms',
	'blue jeans',
	'blue slip ons',
	'boots',
	'business slacks',
	'casual shoes',
	'cutoffs',
	'dress shoes',
	'pink slip ons',
	'runner shoes',
	'runner shorts',
	'sneakers',
	'soccer team swim trunks',
	'swim trunks',
] as const);

export const ACCESSORY_ASSET_MANIFEST = {
	'8 bit glasses': new URL(asset8BitGlasses, import.meta.url).href,
	apron: new URL(apron, import.meta.url).href,
	'baseball cap': new URL(baseballCap, import.meta.url).href,
	beanie: new URL(beanie, import.meta.url).href,
	'bell bottoms': new URL(bellBottoms, import.meta.url).href,
	beret: new URL(beret, import.meta.url).href,
	'blonde wig': new URL(blondeWig, import.meta.url).href,
	'blue jeans': new URL(blueJeans, import.meta.url).href,
	'blue slip ons': new URL(blueSlipOns, import.meta.url).href,
	boots: new URL(boots, import.meta.url).href,
	'bowler hat': new URL(bowlerHat, import.meta.url).href,
	brush: new URL(brush, import.meta.url).href,
	'bug eyes': new URL(bugEyes, import.meta.url).href,
	'business shirt': new URL(businessShirt, import.meta.url).href,
	'business slacks': new URL(businessSlacks, import.meta.url).href,
	cardigan: new URL(cardigan, import.meta.url).href,
	'casual shoes': new URL(casualShoes, import.meta.url).href,
	'cowboy hat': new URL(cowboyHat, import.meta.url).href,
	'cowboy shirt': new URL(cowboyShirt, import.meta.url).href,
	'curly wig': new URL(curlyWig, import.meta.url).href,
	cutoffs: new URL(cutoffs, import.meta.url).href,
	'dress shoes': new URL(dressShoes, import.meta.url).href,
	'goth boots': new URL(gothBoots, import.meta.url).href,
	'hair bow': new URL(hairBow, import.meta.url).href,
	halo: new URL(halo, import.meta.url).href,
	'heart shirt': new URL(heartShirt, import.meta.url).href,
	lasso: new URL(lasso, import.meta.url).href,
	'leather jacket': new URL(leatherJacket, import.meta.url).href,
	'left goth boot': new URL(leftGothBoot, import.meta.url).href,
	lifeguard: new URL(lifeguard, import.meta.url).href,
	'magic wand': new URL(magicWand, import.meta.url).href,
	microphone: new URL(microphone, import.meta.url).href,
	mohawk: new URL(mohawk, import.meta.url).href,
	palette: new URL(palette, import.meta.url).href,
	pencil: new URL(pencil, import.meta.url).href,
	'pink slip ons': new URL(pinkSlipOns, import.meta.url).href,
	'punk skirt': new URL(punkSkirt, import.meta.url).href,
	'right goth boot': new URL(rightGothBoot, import.meta.url).href,
	'rock star boots': new URL(rockStarBoots, import.meta.url).href,
	'rock star ruffle': new URL(rockStarRuffle, import.meta.url).href,
	'runner headband': new URL(runnerHeadband, import.meta.url).href,
	'runner shoes': new URL(runnerShoes, import.meta.url).href,
	'runner shorts': new URL(runnerShorts, import.meta.url).href,
	'runner singlet': new URL(runnerSinglet, import.meta.url).href,
	'saddle shoes': new URL(saddleShoes, import.meta.url).href,
	'santa hat': new URL(santaHat, import.meta.url).href,
	'skull shirt': new URL(skullShirt, import.meta.url).href,
	sneakers: new URL(sneakers, import.meta.url).href,
	snorkel: new URL(snorkel, import.meta.url).href,
	'soccer team shirt': new URL(soccerTeamShirt, import.meta.url).href,
	'soccer team swim trunks': new URL(soccerTeamSwimTrunks, import.meta.url).href,
	'stripe shirt': new URL(stripeShirt, import.meta.url).href,
	'superhero cape': new URL(superheroCape, import.meta.url).href,
	'superhero mask': new URL(superheroMask, import.meta.url).href,
	'superhero stars': new URL(superheroStars, import.meta.url).href,
	'swim trunks': new URL(swimTrunks, import.meta.url).href,
	swimsuit: new URL(swimsuit, import.meta.url).href,
	vest: new URL(vest, import.meta.url).href,
	'white pants': new URL(whitePants, import.meta.url).href,
	wings: new URL(wings, import.meta.url).href,
	'witch boots': new URL(witchBoots, import.meta.url).href,
	'wizard hat': new URL(wizardHat, import.meta.url).href,
	'wizard robe': new URL(wizardRobe, import.meta.url).href,
	'xr goggles': new URL(xrGoggles, import.meta.url).href,
} as const satisfies Record<string, string>;
