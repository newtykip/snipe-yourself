import { Command } from '@oclif/core';
import Conf from 'conf';
import { Table } from 'console-table-printer';
import { schema, Config, redactedSettings } from '../../constants';
import { formatSetting } from '../../utils';

export default class List extends Command {
    static description: string = 'list all of the available settings!';
    static aliases: string[] = ['config view'];

    static examples: string[] = ['$ snipe config list'];

    async run() {
        const config = new Conf<Config>({ schema });
        const table = new Table();

        // Add settings to the table
        Object.keys(config.store).forEach((k: keyof Config) => {
            const value = config.get(k);

            table.addRow({
                Setting: formatSetting(k),
                Value: !value ? '[undefined]' : redactedSettings.includes(k) ? '[redacted]' : value,
                Description: schema[k].description
            });
        });

        table.printTable();
    }
}
