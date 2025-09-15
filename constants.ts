
import type { Vibe, VoiceActor, VoiceVibe, VideoModel, AspectRatio } from './types';

export const VIBES: Vibe[] = [
  { id: 'modern', name: 'Modern', icon: '✨' },
  { id: 'vintage', name: 'Vintage', icon: '📽️' },
  { id: 'minimalist', name: 'Minimalist', icon: '⚪' },
  { id: 'luxury', name: 'Luxury', icon: '💎' },
  { id: 'natural', name: 'Natural', icon: '🌿' },
  { id: 'playful', name: 'Playful', icon: '🎉' },
];

export const STORYBOARD_PROMPTS: string[] = [
  "Close-up shot of the product, looking clean and appealing. Background has a {vibe} vibe.",
  "Shot of the product being used by someone (use the provided face if available). They look happy and satisfied. The setting is {vibe}.",
  "A creative shot showcasing the main benefit of the product. Description: {description}. Vibe is {vibe}.",
  "Lifestyle shot showing the product in a real-world setting. e.g., on a bathroom counter, in a gym bag. Vibe: {vibe}.",
  "Text overlay: '[Your Brand Name]' with the product in the background. The text style should match the {vibe} vibe.",
  "Final shot showing the product with a call to action, like 'Try it today!'. Background is {vibe}."
];

export const VOICE_ACTORS: VoiceActor[] = [
    { id: 'alloy', name: 'Alloy (Male)' },
    { id: 'echo', name: 'Echo (Female)' },
    { id: 'fable', name: 'Fable (Male)' },
    { id: 'onyx', name: 'Onyx (Male, Deep)' },
    { id: 'nova', name: 'Nova (Female, Upbeat)' },
    { id: 'shimmer', name: 'Shimmer (Female, Whisper)' },
];

export const VOICE_VIBES: VoiceVibe[] = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'energetic', name: 'Energetic' },
    { id: 'calm', name: 'Calm' },
    { id: 'dramatic', name: 'Dramatic' },
];

export const VIDEO_MODELS: VideoModel[] = ['VEO 2.0'];

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '9:16', '16:9', '4:3', '3:4'];
