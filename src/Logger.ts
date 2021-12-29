import chalk from 'chalk';
import figures from 'figures';

export default class {
    static error(message: string) {
        console.log(chalk.red(`${chalk.bold(figures.cross)}  ${message}`));
    }

    static success(message: string) {
        console.log(chalk.greenBright(`${chalk.bold(figures.tick)}  ${message}`));
    }

    static warn(message: string) {
        console.log(chalk.yellow(`${chalk.bold('?')}  ${message}`));
    }
}
