import chalk from 'chalk';
import type {
    beatmaps_short_2_object as Beatmap,
    user_data as User,
    user_scores_object as Score
} from 'osu-api-extended/dist/types/v2';

export const logError = (...text: any[]) => console.log(chalk.bold(chalk.red(...text)));
export const validModes = ['osu', 'mania', 'taiko', 'fruits'];

export const rankColours = {
    A: chalk.green,
    B: chalk.blue,
    C: chalk.magenta,
    D: chalk.red,
    S: chalk.yellow,
    SH: chalk.gray
};

export const rebase = async (score: Score, user: User, beatmap: Beatmap): Promise<number> => {
    const { max_combo: maxCombo } = beatmap;
    const {
        max_combo: scoreCombo,
        statistics: {
            count_50: count50,
            count_100: count100,
            count_300: count300,
            count_miss: misscount
        }
    } = score;

    const comboPercentage = scoreCombo / maxCombo;
    const badAccuracy = misscount + count50 * 8 + count100 * 2 * (count300 / maxCombo);
    const accDiff = Math.floor(user['statistics'].hit_accuracy) - score.accuracy * 100;

    return (accDiff * 1.2 * comboPercentage) / badAccuracy;
};

export namespace SnipeYourself {
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

    export interface Config {
        clientId: number;
        clientSecret: string;
    }
}
