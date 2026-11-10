// Copyright (c) Suigar
// SPDX-License-Identifier: Apache-2.0

import type { Meta, StoryObj } from '@storybook/react-vite';
import { CataloguePreview } from './CataloguePreview.js';

const meta = {
	title: 'Suifrens/Characters/Expressions',
	component: CataloguePreview,
	tags: ['!autodocs'],
} satisfies Meta<typeof CataloguePreview>;
export default meta;

export const BigSmile: StoryObj<typeof meta> = {
	args: { title: 'bigSmile', expression: 'bigSmile' },
};
export const Happy: StoryObj<typeof meta> = { args: { title: 'happy', expression: 'happy' } };
export const HeartEyes: StoryObj<typeof meta> = {
	args: { title: 'heartEyes', expression: 'heartEyes' },
};
export const Kiss: StoryObj<typeof meta> = { args: { title: 'kiss', expression: 'kiss' } };
export const Laughing: StoryObj<typeof meta> = {
	args: { title: 'laughing', expression: 'laughing' },
};
export const Relaxed: StoryObj<typeof meta> = { args: { title: 'relaxed', expression: 'relaxed' } };
export const TongueOut: StoryObj<typeof meta> = {
	args: { title: 'tongueOut', expression: 'tongueOut' },
};
export const Wink: StoryObj<typeof meta> = { args: { title: 'wink', expression: 'wink' } };
export const Goofy: StoryObj<typeof meta> = { args: { title: 'goofy', expression: 'goofy' } };
export const Angry: StoryObj<typeof meta> = { args: { title: 'angry', expression: 'angry' } };
export const Annoyed: StoryObj<typeof meta> = { args: { title: 'annoyed', expression: 'annoyed' } };
export const Blush: StoryObj<typeof meta> = { args: { title: 'blush', expression: 'blush' } };
export const Cool: StoryObj<typeof meta> = { args: { title: 'cool', expression: 'cool' } };
export const Crying: StoryObj<typeof meta> = { args: { title: 'crying', expression: 'crying' } };
export const DizzyFace: StoryObj<typeof meta> = {
	args: { title: 'dizzyFace', expression: 'dizzyFace' },
};
export const Grimace: StoryObj<typeof meta> = { args: { title: 'grimace', expression: 'grimace' } };
export const Mischievous: StoryObj<typeof meta> = {
	args: { title: 'mischievous', expression: 'mischievous' },
};
export const Sad: StoryObj<typeof meta> = { args: { title: 'sad', expression: 'sad' } };
export const Shocked: StoryObj<typeof meta> = { args: { title: 'shocked', expression: 'shocked' } };
export const Sleepy: StoryObj<typeof meta> = { args: { title: 'sleepy', expression: 'sleepy' } };
