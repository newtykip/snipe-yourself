import chalk from 'chalk';

export default class {
    static error(message: string) {
        console.log(chalk.red(`${chalk.bold('[ERROR]')} ${message}`));
    }

    static success(message: string) {
        console.log(chalk.greenBright(`${chalk.bold('[SUCCESS]')} ${message}`));
    }
}
