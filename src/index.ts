#!/usr/bin/env node
import { v2 as osu } from 'osu-api-extended';
import inquirer from 'inquirer';
import Conf from 'conf';
import Listr from 'listr';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import type { user_data as User } from 'osu-api-extended/dist/types/v2';
import {
    rankColours,
    rebase,
    SnipeYourself,
    logError,
    validModes,
    logSuccess,
    schema,
    redactedSettings,
    generateList
} from './utils.js';
import { Command as Commander } from 'commander';

// todo: cache map data for rebases
// todo: colorise all tables
// todo: dedicated logger - ayano?

const { version } = JSON.parse(fs.readFileSync(path.resolve('package.json')).toString());
const program = new Commander().version(version);

// Load all commands
fs.readdirSync(path.resolve('build', 'commands')).forEach(file => {
    // todo: subcommand support
    const { default: Command } = require(path.resolve(__dirname, 'commands', file));
    const command = new Command();

    program
        .command(`${command.name} ${command.parsedArgs}`)
        .description(command.description)
        .action((...args) => command.run(...args));
});

// program
//     .command('profile')
//     .argument('<id>', "The profile's ID")
//     .argument('[mode]', 'The chosen osu gamemode', 'osu')
//     .option('-c, --console', 'Displays the output in the console')
//     .option('-j, --json <path>', 'Outputs all of the results as JSON')
//     .description("rate a profile's chokes from its ID")
//     .action(async (id: string, mode: string, options: { console: boolean; json: string }) => {
//         // Default to output to the console
//         if (!options.console && !options.json) options.console = true;

//         if (options.json) {
//             const { default: isValidPath } = await import('is-valid-path');

//             // todo: maybe create folders if they do not exist?
//             if (!isValidPath(options.json) || !fs.existsSync(options.json)) {
//                 return logError(
//                     `"${options.json}" is not a valid path! Please ensure that it exists, and that you have inputted it correctly!`
//                 );
//             }
//         }

//         // Ensure that the inputted user ID is numeric
//         const userId = parseInt(id);

//         if (isNaN(userId)) {
//             return logError(
//                 `"${userId}" is not a valid number, and therefore can not be a user ID!`
//             );
//         }

//         // Parse the mode argument
//         const parsedMode = validModes.includes(mode.toLowerCase()) ? mode.toLowerCase() : null;

//         if (!parsedMode) {
//             return logError(
//                 `"${mode}" is not a valid gamemode! Please choose one of the following: ${generateList(
//                     validModes
//                 )}`
//             );
//         }

//         // Read the config store
//         const config = new Conf<SnipeYourself.Config>({
//             schema
//         });
//         let clientId = config.get('client_id');
//         let clientSecret = config.get('client_secret');

//         new Promise(async resolve => {
//             var questions: inquirer.InputQuestion<any>[] = [];

//             if (!clientId) {
//                 questions.push({
//                     name: 'clientId',
//                     type: 'input',
//                     message: 'Enter your osu! client ID:',
//                     validate: value => (isNaN(value) ? 'Your client ID must be a number!' : true)
//                 });
//             }

//             if (!clientSecret) {
//                 questions.push({
//                     name: 'clientSecret',
//                     type: 'input',
//                     message: 'Enter your osu! client secret:'
//                 });
//             }

//             // Fire the inquirer
//             if (questions.length > 0) {
//                 const results = await inquirer.prompt(questions);

//                 if (results['clientId']) {
//                     clientId = parseInt(results['clientId']);
//                     config.set('client_id', clientId);
//                 }

//                 if (results['clientSecret']) {
//                     clientSecret = results['clientSecret'];
//                     config.set('client_secret', clientSecret);
//                 }
//             }

//             resolve(null);
//         }).then(() => {
//             let user: User;
//             let scores: SnipeYourself.Score[] = [];

//             new Listr([
//                 {
//                     title: 'Log into the osu! API',
//                     task: async () => await osu.login(clientId, clientSecret)
//                 },
//                 {
//                     title: 'Find the user on osu!',
//                     task: async () => {
//                         user = await osu.user.get(userId, parsedMode as any);

//                         // @ts-ignore
//                         if (user.hasOwnProperty('error')) {
//                             throw new Error(
//                                 `A valid user does not exist on osu! with the ID ${userId}`
//                             );
//                         }

//                         if (
//                             Object.keys(user).length <= 1 &&
//                             String(user['authentication']).toLowerCase() === 'basic'
//                         ) {
//                             throw new Error(
//                                 `Please check that your authentication details are correct in the config!`
//                             );
//                             // todo: prompt for new details?
//                         }
//                     }
//                 },
//                 {
//                     title: "Fetch the user's top plays and rebase them",
//                     task: async () => {
//                         const { default: Bluebird } = await import('bluebird');

//                         const bestScores = await osu.scores.users.best(user.id, {
//                             mode: parsedMode as any,
//                             limit: 100
//                         });

//                         scores = await Bluebird.map(
//                             bestScores,
//                             async (score): Promise<SnipeYourself.Score> => {
//                                 const beatmap = await osu.beatmap.get(score.beatmap.id);

//                                 return {
//                                     rebase: await rebase(score, user, beatmap),
//                                     beatmapUrl: `https://osu.ppy.sh/b/${score.beatmap.id}`,
//                                     name: score.beatmapset.title_unicode,
//                                     difficulty: score.beatmap.version,
//                                     accuracy: score.accuracy * 100,
//                                     rank: score.rank,
//                                     maxCombo: beatmap.max_combo,
//                                     combo: score.max_combo
//                                 };
//                             }
//                         );
//                     }
//                 },
//                 {
//                     title: 'Sort the scores by rebase',
//                     task: () => {
//                         console.log(scores.filter(s => s.accuracy === 100).length);
//                         scores = scores
//                             .sort((a, b) => b.rebase - a.rebase)
//                             .filter(s => s.accuracy !== 100)
//                             .filter(s => s.rebase > 0);
//                     }
//                 }
//             ])
//                 .run()
//                 .then(async () => {
//                     const ranks = scores
//                         .map(score => score.rank)
//                         .filter((v, i, s) => s.indexOf(v) === i);

//                     if (options.console) {
//                         // Load dynamic modules
//                         const { default: link } = await import('terminal-link');
//                         const { Table } = await import('console-table-printer');

//                         const sendTable = (rank: string) => {
//                             const scoresOfRank = scores
//                                 .filter(s => s.rank === rank)
//                                 .sort((a, b) => b.rebase - a.rebase);
//                             const table = new Table();

//                             console.log(
//                                 chalk.bold(rankColours[rank.toUpperCase()](rank.substring(0)))
//                             );

//                             scoresOfRank.forEach(score =>
//                                 table.addRow({
//                                     'Beatmap Name': link(score.name, score.beatmapUrl),
//                                     Difficulty: score.difficulty,
//                                     'Rebase Value': score.rebase.toFixed(5),
//                                     Combo: `${score.combo}/${score.maxCombo}`,
//                                     Accuracy: `${score.accuracy.toFixed(2)}%`
//                                 })
//                             );

//                             table.printTable();
//                         };

//                         if (ranks.includes('SH')) sendTable('SH');
//                         if (ranks.includes('S')) sendTable('S');
//                         if (ranks.includes('A')) sendTable('A');
//                         if (ranks.includes('B')) sendTable('B');
//                         if (ranks.includes('C')) sendTable('C');
//                         if (ranks.includes('D')) sendTable('D');
//                     }

//                     if (options.json) {
//                         ranks.forEach(rank => {
//                             const scoresOfRank = scores
//                                 .filter(s => s.rank === rank)
//                                 .sort((a, b) => b.rebase - a.rebase);

//                             fs.writeFileSync(
//                                 path.join(options.json, `${rank.toUpperCase()}.json`),
//                                 JSON.stringify(scoresOfRank, null, 4)
//                             );
//                         });
//                     }
//                 });
//         });
//     });

// const config = program.command('config <subcommand>').description('modify the config');

// config
//     .command('list')
//     .alias('view')
//     .description('list all of the available settings')
//     .action(async () => {
//         const config = new Conf({ schema });

//         // Output them
//         const { Table } = await import('console-table-printer');
//         const table = new Table();

//         Object.keys(config.store).forEach((k: keyof SnipeYourself.Config) => {
//             const value = config.get(k);

//             table.addRow({
//                 Setting: k,
//                 Value: !value ? '[undefined]' : redactedSettings.includes(k) ? '[redacted]' : value,
//                 Description: schema[k].description
//             });
//         });

//         table.printTable();
//     });

// config
//     .command('set')
//     .alias('update')
//     .argument('<setting>', 'the setting to update')
//     .argument('<value>', 'the value to update it with')
//     .description('update a setting with a new value')
//     .action((setting: keyof SnipeYourself.Config, value: string) => {
//         // todo: parse a lack of underscores
//         setting = setting.toLowerCase() as keyof SnipeYourself.Config;

//         // Ensure that the setting exists
//         if (![Object.keys(schema).find(k => k.toLowerCase() === setting.toLowerCase())]) {
//             return logError(
//                 `"${setting}" is not a valid setting. Please choose one of the following: ${generateList(
//                     Object.keys(schema)
//                 )}`
//             );
//         }

//         // Update the setting
//         const config = new Conf<SnipeYourself.Config>({ schema });
//         const type = schema[setting].type;

//         try {
//             config.set(setting, type.includes('number') ? parseInt(value) : value);
//         } catch (e) {
//             return logError(
//                 `The value for "${setting}" must be a ${type[0].toLowerCase()}! Please try again!`
//             );
//         }

//         logSuccess(
//             `Successfully updated "${setting}" to ${type.includes('number') ? value : `"${value}"`}`
//         );
//     });

// config
//     .command('reset')
//     .description('remove all available config')
//     .action(() => {
//         const config = new Conf({ schema });
//         config.clear();
//         logSuccess('The config has been succesfully reset!');
//     });

program.parse();
