// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import _8_bit_glasses from './accessory-assets/8-bit-glasses.svg?url';
import apron from './accessory-assets/apron.svg?url';
import baseball_cap from './accessory-assets/baseball-cap.svg?url';
import beanie from './accessory-assets/beanie.svg?url';
import bell_bottoms from './accessory-assets/bell-bottoms.svg?url';
import beret from './accessory-assets/beret.svg?url';
import blonde_wig from './accessory-assets/blonde-wig.svg?url';
import blue_jeans from './accessory-assets/blue-jeans.svg?url';
import blue_slip_ons from './accessory-assets/blue-slip-ons.svg?url';
import boots from './accessory-assets/boots.svg?url';
import bowler_hat from './accessory-assets/bowler-hat.svg?url';
import brush from './accessory-assets/brush.svg?url';
import bug_eyes from './accessory-assets/bug-eyes.svg?url';
import business_shirt from './accessory-assets/business-shirt.svg?url';
import business_slacks from './accessory-assets/business-slacks.svg?url';
import cardigan from './accessory-assets/cardigan.svg?url';
import casual_shoes from './accessory-assets/casual-shoes.svg?url';
import cowboy_hat from './accessory-assets/cowboy-hat.svg?url';
import cowboy_shirt from './accessory-assets/cowboy-shirt.svg?url';
import curly_wig from './accessory-assets/curly-wig.svg?url';
import cutoffs from './accessory-assets/cutoffs.svg?url';
import dress_shoes from './accessory-assets/dress-shoes.svg?url';
import goth_boots from './accessory-assets/goth-boots.svg?url';
import hair_bow from './accessory-assets/hair-bow.svg?url';
import halo from './accessory-assets/halo.svg?url';
import heart_shirt from './accessory-assets/heart-shirt.svg?url';
import lasso from './accessory-assets/lasso.svg?url';
import leather_jacket from './accessory-assets/leather-jacket.svg?url';
import left_goth_boot from './accessory-assets/left-goth-boot.svg?url';
import lifeguard from './accessory-assets/lifeguard.svg?url';
import magic_wand from './accessory-assets/magic-wand.svg?url';
import microphone from './accessory-assets/microphone.svg?url';
import mohawk from './accessory-assets/mohawk.svg?url';
import palette from './accessory-assets/palette.svg?url';
import pencil from './accessory-assets/pencil.svg?url';
import pink_slip_ons from './accessory-assets/pink-slip-ons.svg?url';
import punk_skirt from './accessory-assets/punk-skirt.svg?url';
import right_goth_boot from './accessory-assets/right-goth-boot.svg?url';
import rock_star_boots from './accessory-assets/rock-star-boots.svg?url';
import rock_star_ruffle from './accessory-assets/rock-star-ruffle.svg?url';
import saddle_shoes from './accessory-assets/saddle-shoes.svg?url';
import santa_hat from './accessory-assets/santa-hat.svg?url';
import skull_shirt from './accessory-assets/skull-shirt.svg?url';
import sneakers from './accessory-assets/sneakers.svg?url';
import snorkel from './accessory-assets/snorkel.svg?url';
import stripe_shirt from './accessory-assets/stripe-shirt.svg?url';
import superhero_cape from './accessory-assets/superhero-cape.svg?url';
import superhero_mask from './accessory-assets/superhero-mask.svg?url';
import superhero_stars from './accessory-assets/superhero-stars.svg?url';
import swim_trunks from './accessory-assets/swim-trunks.svg?url';
import swimsuit from './accessory-assets/swimsuit.svg?url';
import vest from './accessory-assets/vest.svg?url';
import white_pants from './accessory-assets/white-pants.svg?url';
import wings from './accessory-assets/wings.svg?url';
import witch_boots from './accessory-assets/witch-boots.svg?url';
import wizard_hat from './accessory-assets/wizard-hat.svg?url';
import wizard_robe from './accessory-assets/wizard-robe.svg?url';
import xr_goggles from './accessory-assets/xr-goggles.svg?url';

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
	'sneakers',
	'swim trunks',
] as const);

export const ACCESSORY_ASSET_MANIFEST = {
	'8 bit glasses': _8_bit_glasses,
	apron: apron,
	'baseball cap': baseball_cap,
	beanie: beanie,
	'bell bottoms': bell_bottoms,
	beret: beret,
	'blonde wig': blonde_wig,
	'blue jeans': blue_jeans,
	'blue slip ons': blue_slip_ons,
	boots: boots,
	'bowler hat': bowler_hat,
	brush: brush,
	'bug eyes': bug_eyes,
	'business shirt': business_shirt,
	'business slacks': business_slacks,
	cardigan: cardigan,
	'casual shoes': casual_shoes,
	'cowboy hat': cowboy_hat,
	'cowboy shirt': cowboy_shirt,
	'curly wig': curly_wig,
	cutoffs: cutoffs,
	'dress shoes': dress_shoes,
	'goth boots': goth_boots,
	'hair bow': hair_bow,
	halo: halo,
	'heart shirt': heart_shirt,
	lasso: lasso,
	'leather jacket': leather_jacket,
	'left goth boot': left_goth_boot,
	lifeguard: lifeguard,
	'magic wand': magic_wand,
	microphone: microphone,
	mohawk: mohawk,
	palette: palette,
	pencil: pencil,
	'pink slip ons': pink_slip_ons,
	'punk skirt': punk_skirt,
	'right goth boot': right_goth_boot,
	'rock star boots': rock_star_boots,
	'rock star ruffle': rock_star_ruffle,
	'saddle shoes': saddle_shoes,
	'santa hat': santa_hat,
	'skull shirt': skull_shirt,
	sneakers: sneakers,
	snorkel: snorkel,
	'stripe shirt': stripe_shirt,
	'superhero cape': superhero_cape,
	'superhero mask': superhero_mask,
	'superhero stars': superhero_stars,
	'swim trunks': swim_trunks,
	swimsuit: swimsuit,
	vest: vest,
	'white pants': white_pants,
	wings: wings,
	'witch boots': witch_boots,
	'wizard hat': wizard_hat,
	'wizard robe': wizard_robe,
	'xr goggles': xr_goggles,
} as const satisfies Record<string, string>;
