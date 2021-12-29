import { Command } from '@oclif/core';
import { ArgInput } from '@oclif/core/lib/interfaces';
import Conf from 'conf';
import * as stringSimilarity from 'string-similarity';
import { Config, schema } from '../../constants';
import Logger from '../../Logger';
import { formatSetting } from '../../utils';

export default class Set extends Command {
    static description: string = 'update a setting with a new value!';

    static args: ArgInput = [
        { name: 'setting', description: 'setting to update', required: true },
        { name: 'value', description: 'value to update the setting to', required: true }
    ];

    async run() {
        const config = new Conf({ schema });
        const { args } = await this.parse(Set);

        // Find the closest key in the config
        const setting = stringSimilarity.findBestMatch(args.setting, Object.keys(schema)).bestMatch
            .target as keyof Config;

        // Update the config
        const { value } = args;
        const { type } = schema[setting];

        try {
            config.set(setting, type.includes('number') ? parseInt(value) : value);

            Logger.success(
                `Successfully updated ${formatSetting(setting)} to ${
                    type.includes('number') ? value : `${value}`
                }`
            );
        } catch (error) {
            Logger.error(
                `The value for ${formatSetting(
                    setting
                )} must be a ${type[0].toLowerCase()}! Please try again!`
            );
        }
    }
}
