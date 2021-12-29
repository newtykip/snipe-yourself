import type { Schema } from 'conf/dist/source';

export interface Config {
    client_id: number;
    client_secret: string;
    autocorrect_confidence: number;
    profile_id: number;
}

export interface Credentials {
    clientId: number;
    clientSecret: string;
}

export interface Score {
    rebase: number;
    beatmapUrl: string;
    name: string;
    difficulty: string;
    accuracy: number;
    rank: string;
    maxCombo: number;
    combo: number;
}

export const schema: Schema<Config> = {
    client_id: {
        type: ['number', 'null'],
        description: "Your osu! OAuth Client's ID",
        default: null
    },
    client_secret: {
        type: ['string', 'null'],
        description: "Your osu! OAuth Client's secret",
        default: null
    },
    autocorrect_confidence: {
        type: ['number', 'null'],
        description: 'The minimum confidence required for the autocorrect to kick in',
        default: 0.5
    },
    profile_id: {
        type: ['number', 'null'],
        description: "Your profile's ID!",
        default: null
    }
};

export const redactedSettings: (keyof Config)[] = ['client_secret'];

export const validModes = ['osu', 'mania', 'taiko', 'fruits'] as const;
