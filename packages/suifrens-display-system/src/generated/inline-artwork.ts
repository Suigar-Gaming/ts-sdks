// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import layer0 from '../accessories/8-bit-glasses.svg';
import layer1 from '../accessories/apron/body.svg';
import layer2 from '../accessories/apron/default.svg';
import layer3 from '../accessories/baseball-cap.svg';
import layer4 from '../accessories/beanie.svg';
import layer5 from '../accessories/bell-bottoms.svg';
import layer6 from '../accessories/beret.svg';
import layer7 from '../accessories/blonde-wig.svg';
import layer8 from '../accessories/blue-jeans.svg';
import layer9 from '../accessories/blue-slip-ons.svg';
import layer10 from '../accessories/boots.svg';
import layer11 from '../accessories/bowler-hat.svg';
import layer12 from '../accessories/brush.svg';
import layer13 from '../accessories/bug-eyes.svg';
import layer14 from '../accessories/business-shirt/body.svg';
import layer15 from '../accessories/business-shirt/default.svg';
import layer16 from '../accessories/business-shirt/left.svg';
import layer17 from '../accessories/business-shirt/right.svg';
import layer18 from '../accessories/business-slacks.svg';
import layer19 from '../accessories/cardigan/body.svg';
import layer20 from '../accessories/cardigan/default.svg';
import layer21 from '../accessories/cardigan/left.svg';
import layer22 from '../accessories/cardigan/right.svg';
import layer23 from '../accessories/casual-shoes.svg';
import layer24 from '../accessories/cowboy-hat.svg';
import layer25 from '../accessories/cowboy-shirt/body.svg';
import layer26 from '../accessories/cowboy-shirt/default.svg';
import layer27 from '../accessories/cowboy-shirt/left.svg';
import layer28 from '../accessories/cowboy-shirt/right.svg';
import layer29 from '../accessories/curly-wig.svg';
import layer30 from '../accessories/cutoffs.svg';
import layer31 from '../accessories/dress-shoes.svg';
import layer32 from '../accessories/goth-boots.svg';
import layer33 from '../accessories/hair-bow.svg';
import layer34 from '../accessories/halo.svg';
import layer35 from '../accessories/heart-shirt/body.svg';
import layer36 from '../accessories/heart-shirt/default.svg';
import layer37 from '../accessories/heart-shirt/left.svg';
import layer38 from '../accessories/heart-shirt/right.svg';
import layer39 from '../accessories/lasso.svg';
import layer40 from '../accessories/leather-jacket/body.svg';
import layer41 from '../accessories/leather-jacket/default.svg';
import layer42 from '../accessories/leather-jacket/left.svg';
import layer43 from '../accessories/leather-jacket/right.svg';
import layer44 from '../accessories/left-goth-boot.svg';
import layer45 from '../accessories/lifeguard/body.svg';
import layer46 from '../accessories/lifeguard/default.svg';
import layer47 from '../accessories/lifeguard/left.svg';
import layer48 from '../accessories/lifeguard/right.svg';
import layer49 from '../accessories/magic-wand.svg';
import layer50 from '../accessories/microphone.svg';
import layer51 from '../accessories/mohawk.svg';
import layer52 from '../accessories/palette.svg';
import layer53 from '../accessories/pencil.svg';
import layer54 from '../accessories/pink-slip-ons.svg';
import layer55 from '../accessories/punk-skirt.svg';
import layer56 from '../accessories/right-goth-boot.svg';
import layer57 from '../accessories/rock-star-boots.svg';
import layer58 from '../accessories/rock-star-ruffle.svg';
import layer59 from '../accessories/saddle-shoes.svg';
import layer60 from '../accessories/santa-hat.svg';
import layer61 from '../accessories/skull-shirt/body.svg';
import layer62 from '../accessories/skull-shirt/default.svg';
import layer63 from '../accessories/skull-shirt/left.svg';
import layer64 from '../accessories/skull-shirt/right.svg';
import layer65 from '../accessories/sneakers.svg';
import layer66 from '../accessories/snorkel.svg';
import layer67 from '../accessories/stripe-shirt/body.svg';
import layer68 from '../accessories/stripe-shirt/default.svg';
import layer69 from '../accessories/stripe-shirt/left.svg';
import layer70 from '../accessories/stripe-shirt/right.svg';
import layer71 from '../accessories/superhero-cape.svg';
import layer72 from '../accessories/superhero-mask.svg';
import layer73 from '../accessories/superhero-stars.svg';
import layer74 from '../accessories/swim-trunks.svg';
import layer75 from '../accessories/swimsuit/body.svg';
import layer76 from '../accessories/swimsuit/default.svg';
import layer77 from '../accessories/vest/body.svg';
import layer78 from '../accessories/vest/default.svg';
import layer79 from '../accessories/white-pants.svg';
import layer80 from '../accessories/wings/default.svg';
import layer81 from '../accessories/wings/right.svg';
import layer82 from '../accessories/witch-boots.svg';
import layer83 from '../accessories/wizard-hat.svg';
import layer84 from '../accessories/wizard-robe/body.svg';
import layer85 from '../accessories/wizard-robe/default.svg';
import layer86 from '../accessories/wizard-robe/left.svg';
import layer87 from '../accessories/wizard-robe/right.svg';
import layer88 from '../accessories/xr-goggles.svg';
export const ARTWORK: Readonly<Record<string, Readonly<Record<string, string>>>> = {
	'8 bit glasses': { default: layer0 },
	apron: { body: layer1, default: layer2 },
	'baseball cap': { default: layer3 },
	beanie: { default: layer4 },
	'bell bottoms': { default: layer5 },
	beret: { default: layer6 },
	'blonde wig': { default: layer7 },
	'blue jeans': { default: layer8 },
	'blue slip ons': { default: layer9 },
	boots: { default: layer10 },
	'bowler hat': { default: layer11 },
	brush: { default: layer12 },
	'bug eyes': { default: layer13 },
	'business shirt': { body: layer14, default: layer15, left: layer16, right: layer17 },
	'business slacks': { default: layer18 },
	cardigan: { body: layer19, default: layer20, left: layer21, right: layer22 },
	'casual shoes': { default: layer23 },
	'cowboy hat': { default: layer24 },
	'cowboy shirt': { body: layer25, default: layer26, left: layer27, right: layer28 },
	'curly wig': { default: layer29 },
	cutoffs: { default: layer30 },
	'dress shoes': { default: layer31 },
	'goth boots': { default: layer32 },
	'hair bow': { default: layer33 },
	halo: { default: layer34 },
	'heart shirt': { body: layer35, default: layer36, left: layer37, right: layer38 },
	lasso: { default: layer39 },
	'leather jacket': { body: layer40, default: layer41, left: layer42, right: layer43 },
	'left goth boot': { default: layer44 },
	lifeguard: { body: layer45, default: layer46, left: layer47, right: layer48 },
	'magic wand': { default: layer49 },
	microphone: { default: layer50 },
	mohawk: { default: layer51 },
	palette: { default: layer52 },
	pencil: { default: layer53 },
	'pink slip ons': { default: layer54 },
	'punk skirt': { default: layer55 },
	'right goth boot': { default: layer56 },
	'rock star boots': { default: layer57 },
	'rock star ruffle': { default: layer58 },
	'saddle shoes': { default: layer59 },
	'santa hat': { default: layer60 },
	'skull shirt': { body: layer61, default: layer62, left: layer63, right: layer64 },
	sneakers: { default: layer65 },
	snorkel: { default: layer66 },
	'stripe shirt': { body: layer67, default: layer68, left: layer69, right: layer70 },
	'superhero cape': { default: layer71 },
	'superhero mask': { default: layer72 },
	'superhero stars': { default: layer73 },
	'swim trunks': { default: layer74 },
	swimsuit: { body: layer75, default: layer76 },
	vest: { body: layer77, default: layer78 },
	'white pants': { default: layer79 },
	wings: { default: layer80, right: layer81 },
	'witch boots': { default: layer82 },
	'wizard hat': { default: layer83 },
	'wizard robe': { body: layer84, default: layer85, left: layer86, right: layer87 },
	'xr goggles': { default: layer88 },
};
