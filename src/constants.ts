import type { Schema } from 'conf/dist/source';

export interface Config {
    client_id: number;
    client_secret: string;
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
    }
};

export const redactedSettings: (keyof Config)[] = ['client_secret'];
