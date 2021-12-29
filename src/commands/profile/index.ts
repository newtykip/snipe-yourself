import { Command, Flags } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import isValidPath from 'is-valid-path';
import fs from 'fs';
import Logger from '../../Logger';
import { validModes, schema, Config, Score, friendlyDays } from '../../constants';
import Conf from 'conf';
import { fetchCredentials, fetchProfileId, rankTable, rebase } from '../../utils';
import type {
    user_data as User,
    user_scores_object as UserScore
} from 'osu-api-extended/dist/types/v2';
import Listr from 'listr';
import { v2 as osu } from 'osu-api-extended';
import Bluebird from 'bluebird';
import path from 'path';
import dayjs from 'dayjs';
import ord from 'ord';

// todo: add the ability to calculate pp for a map
export default class Profile extends Command {
    static description: string = "rate a profile's chokes in terms of fixability";
    static aliases: string[] = ['calculate'];

    static args: ArgInput = [
        { name: 'query', description: "the profile's ID or username" },
        { name: 'mode', description: 'the chosen osu! gamemode', required: false }
    ];

    static flags = {
        console: Flags.boolean({
            default: true,
            description: 'output the results to the console',
            char: 'c'
        }),
        json: Flags.string({
            description: 'output the results as JSON',
            char: 'j',
            helpValue: 'path'
        }),
        mode: Flags.enum({
            description: 'the mode to calculate for',
            char: 'm',
            helpValue: 'mode',
            options: validModes.map(m => m)
        })
    };

    static examples: string[] = [
        '$ snipe profile 16009610',
        '$ snipe profile 16009610 -j',
        '$ snipe profile 16009610 -c --json',
        '$ snipe profile "Newt x3"',
        '$ snipe profile'
    ];

    async run() {
        const config = new Conf<Config>({ schema });
        const { args, flags } = await this.parse(Profile);

        // Ensure that there was a query
        let query = args.query ?? (await fetchProfileId());

        const queryType: 'id' | 'username' = isNaN(parseInt(query)) ? 'username' : 'id';

        // Parse flags
        let outputConsole: boolean = flags?.['console'] ?? false;
        const outputJson: { enabled: boolean; path: string } = {
            enabled: !!flags?.['json'],
            path: flags?.['json']
        };

        // Default the output to the console
        if (!outputConsole && !outputJson) outputConsole = true;

        if (outputJson.enabled) {
            // Ensure that the path inputted is valid
            // todo: maybe create folders if they do not exist, or at least give the option to do so?
            if (!isValidPath(outputJson.path) || !fs.existsSync(outputJson.path)) {
                return Logger.error(
                    `"${outputJson.path}" is not a valid path! Please ensure that it exists, and that you have inputted it correctly!`
                );
            }
        }

        // Parse the mode flag
        const mode: typeof validModes[number] = flags?.['mode'] ?? 'osu';

        // Fetch the client's credentials
        const { clientId, clientSecret } = await fetchCredentials();
        let user: User;
        let scores: Score[];

        new Listr([
            {
                title: 'Log into the osu! API',
                task: async () => await osu.login(clientId, clientSecret)
            },
            {
                title: 'Find the user on osu!',
                task: async () => {
                    user = await osu.user.get(query, mode, queryType);

                    if (user.hasOwnProperty('error')) {
                        throw new Error(
                            `A valid user does not exist on osu! with the ${queryType} ${
                                queryType === 'id' ? query : `"${query}"`
                            }`
                        );
                    }

                    if (
                        Object.keys(user).length <= 1 &&
                        String(user['authentication']).toLowerCase() === 'basic'
                    ) {
                        throw new Error(
                            `Please check that your authentication details are correct in the config!`
                        );
                        // todo: prompt for new details?
                    }
                }
            },
            {
                title: "Fetch the user's top plays and rebase them",
                task: async () => {
                    const bestScores = await osu.scores.users.best(user.id, {
                        mode,
                        limit: 100
                    });

                    scores = await Bluebird.map(
                        bestScores,
                        async (score: UserScore): Promise<Score> => {
                            const beatmap = await osu.beatmap.get(score.beatmap.id);

                            return {
                                beatmapUrl: `https://osu.ppy.sh/b/${score.beatmap.id}`,
                                scoreUrl: `https://osu.ppy.sh/scores/${mode}/${score.id}`,
                                name: score.beatmapset.title,
                                difficulty: score.beatmap.version,
                                accuracy: score.accuracy * 100,
                                rank: score.rank,
                                combo: score.max_combo,
                                maxCombo: beatmap.max_combo,
                                mods: `+${score.mods.join('')}`,
                                rebase: await rebase(score, user, beatmap),
                                misses: score.statistics.count_miss
                            };
                        }
                    );
                }
            },
            {
                title: 'Sort the scores by rebase',
                task: () => {
                    console.log(scores.filter(s => s.accuracy === 100).length);
                    scores = scores
                        .sort((a, b) => b.rebase - a.rebase)
                        .filter(s => s.accuracy !== 100)
                        .filter(s => s.rebase > 0);
                }
            }
        ])
            .run()
            .then(async () => {
                const ranks = scores
                    .map(score => score.rank)
                    .filter((v, i, s) => s.indexOf(v) === i);

                if (outputConsole) {
                    ranks.forEach(rank => {
                        const scoresOfRank = scores
                            .filter(s => s.rank === rank)
                            .sort((a, b) => b.rebase - a.rebase);
                        rankTable(scoresOfRank, rank);
                    });
                }

                if (outputJson.enabled) {
                    ranks.forEach(rank => {
                        const scoresOfRank = scores
                            .filter(s => s.rank === rank)
                            .sort((a, b) => b.rebase - a.rebase);

                        const date = new Date();

                        fs.writeFileSync(
                            path.join(outputJson.path, `${rank.toUpperCase()}.json`),
                            JSON.stringify(
                                {
                                    details: {
                                        user: user.username,
                                        userId: user.id,
                                        rank: user['statistics'].global_rank,
                                        pp: user['statistics'].pp,
                                        playCount: user['statistics'].play_count,
                                        calculatedOn: `${
                                            friendlyDays[date.getDay()]
                                        }, ${date.getDate()}${ord(date.getDate())} ${dayjs(
                                            date
                                        ).format('MMMM YYYY h:mma')}`
                                    },
                                    scores: scoresOfRank
                                },
                                null,
                                4
                            )
                        );
                    });
                }
            });
    }
}
