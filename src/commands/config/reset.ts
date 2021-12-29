import { Command } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import Conf from 'conf';
import { Config, schema } from '../../constants';
import Logger from '../../Logger';
import inquirer from 'inquirer';
import { closestSetting, formatSetting, generateList } from '../../utils';

export default class Reset extends Command {
    static description: string = 'reset the config!';
    static aliases: string[] = ['config clear'];

    static args: ArgInput = [{ name: 'setting', description: 'the setting to clear' }];

    static examples: string[] = ['$ snipe config reset'];

    async run() {
        const { args } = await this.parse(Reset);
        const config = new Conf<Config>({ schema });

        if (args?.setting) {
            // Find the closest key in the config
            const setting = closestSetting(args.setting);
            if (!setting) return;

            // Reset the setting to its default value
            config.set(setting, schema?.[setting]?.default);
            Logger.success(
                `The setting "${formatSetting(setting)}" has been reset to its default value!`
            );
        } else {
            const results = await inquirer.prompt([
                {
                    name: 'confirm',
                    type: 'confirm',
                    message: 'Are you sure you would like to wipe the config clean?'
                }
            ]);

            if (results?.confirm) {
                config.clear();
                Logger.success('The config has been successfully reset!');
            } else {
                Logger.error('Operation abandoned');
            }
        }
    }
}
