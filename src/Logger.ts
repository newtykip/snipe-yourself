import chalk from 'chalk';

export default class {
    static error(message: string) {
        console.log(chalk.red(message));
    }

    static success(message: string) {
        console.log(chalk.greenBright(message));
    }

    static warn(message: string) {
        console.log(chalk.yellow(message));
    }
}
