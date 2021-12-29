import Conf from 'conf';
import { Config, Credentials, schema } from './constants';
import inquirer from 'inquirer';
import {
    user_data as User,
    beatmaps_short_2_object as Beatmap,
    user_scores_object as Score
} from 'osu-api-extended/dist/types/v2';

export const formatSetting = (setting: string) =>
    setting
        .split('_')
        .map(s => `${s.substring(0, 1).toUpperCase()}${s.substring(1)}`)
        .join(' ');

export const generateList = (list: any[]) => `\n${list.map(m => `• ${m}`).join('\n')}`;

export const fetchCredentials = async (): Promise<Credentials> => {
    // Read the current state of the config
    const config = new Conf<Config>({ schema });
    let clientId = config.get('client_id');
    let clientSecret = config.get('client_secret');

    // Compile all of the questions
    let questions: inquirer.InputQuestion[] = [];

    if (!clientId)
        questions.push({
            name: 'clientId',
            type: 'input',
            message: 'Enter your osu! client ID:',
            validate: (value: any) => (isNaN(value) ? 'Your client ID must be a number!' : true)
        });

    if (!clientSecret)
        questions.push({
            name: 'clientSecret',
            type: 'input',
            message: 'Enter your osu! client secret:'
        });

    // Fire the inquirer
    if (questions.length > 0) {
        const results = await inquirer.prompt(questions);

        if (results?.['clientId']) {
            clientId = parseInt(results['clientId']);
            config.set('client_id', clientId);
        }

        if (results?.['clientSecret']) {
            clientSecret = results['clientSecret'];
            config.set('client_secret', clientSecret);
        }
    }

    return {
        clientId,
        clientSecret
    };
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
