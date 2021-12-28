import { Command } from '@oclif/core';
import Conf from 'conf';
import { Table } from 'console-table-printer';
import { schema, Config, redactedSettings } from '../../constants';

export default class List extends Command {
    static description = 'list all of the available settings!';

    static examples = ['$ snipe config list'];

    async run() {
        const config = new Conf({ schema });
        const table = new Table();

        // Add settings to the table
        Object.keys(config.store).forEach((k: keyof Config) => {
            const value = config.get(k);

            table.addRow({
                Setting: k
                    .split('_')
                    .map(s => `${s.substring(0, 1).toUpperCase()}${s.substring(1)}`)
                    .join(' '),
                Value: !value ? '[undefined]' : redactedSettings.includes(k) ? '[redacted]' : value,
                Description: schema[k].description
            });
        });

        table.printTable();
    }
}
