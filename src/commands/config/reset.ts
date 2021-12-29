import { Command } from '@oclif/core';
import Conf from 'conf';
import { Config, schema } from '../../constants';
import Logger from '../../Logger';

export default class Reset extends Command {
    static description: string = 'reset the config!';

    static examples: string[] = ['$ snipe config reset'];

    async run() {
        const config = new Conf<Config>({ schema });
        config.clear();
        Logger.success('The config has been successfully reset!');
    }
}
