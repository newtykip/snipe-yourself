import { Command } from '@oclif/core';
import Conf from 'conf';
import { schema } from '../../constants';
import Logger from '../../Logger';

export default class Reset extends Command {
    static description: string = 'reset the config!';

    async run() {
        const config = new Conf({ schema });
        config.clear();
        Logger.success('The config has been successfully reset!');
    }
}
