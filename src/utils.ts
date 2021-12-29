import Conf from 'conf';
import { Config, Credentials, rankColours, schema, Score } from './constants';
import inquirer from 'inquirer';
import {
    user_data as User,
    beatmaps_short_2_object as Beatmap,
    user_scores_object as ApiScore
} from 'osu-api-extended/dist/types/v2';
import chalk from 'chalk';
import link from 'terminal-link';
import { Table } from 'console-table-printer';
import * as stringSimilarity from 'string-similarity';
import Logger from './Logger';

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

export const fetchProfileId = async () => {
    // Read the current state of the config
    const config = new Conf<Config>({ schema });
    let profileId = config.get('profile_id');

    if (!profileId) {
        const results = await inquirer.prompt([
            {
                name: 'profileId',
                type: 'input',
                message: 'Enter your osu! profile ID:',
                validate: (value: any) =>
                    isNaN(value) ? 'Your profile ID must be a number!' : true
            }
        ]);

        if (results?.['profileId']) {
            profileId = parseInt(results?.['profileId']);
            config.set('profile_id', profileId);
        }
    }

    return profileId;
};

export const rebase = async (score: ApiScore, user: User, beatmap: Beatmap): Promise<number> => {
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

export const rankTable = (scores: Score[], rank: string) => {
    const scoresOfRank = scores.filter(s => s.rank === rank).sort((a, b) => b.rebase - a.rebase);

    const table = new Table();

    console.log(chalk.bold(rankColours[rank.toUpperCase()](rank.substring(0))));

    scoresOfRank.forEach(score =>
        table.addRow({
            'Beatmap Name': link(score.name, score.beatmapUrl),
            Difficulty: score.difficulty,
            'Rebase Value': score.rebase.toFixed(5),
            Combo: `${score.combo}/${score.maxCombo}`,
            Accuracy: `${score.accuracy.toFixed(2)}%`
        })
    );

    table.printTable();
};

export const closestSetting = (query: string): keyof Config => {
    const config = new Conf<Config>({ schema });
    const keys = Object.keys(schema);

    // Find the closest key in the config
    const { target, rating } = stringSimilarity.findBestMatch(query, keys).bestMatch;

    // Ensure that it is a good match
    if (rating < config.get('autocorrect_confidence')) {
        Logger.warn(
            `I'm not quite sure what you meant by "${query}", please make sure you choose an option from the list below: ${generateList(
                keys.map(k => formatSetting(k))
            )}`
        );
    }

    return target as keyof Config;
};
