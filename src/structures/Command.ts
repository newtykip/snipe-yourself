export default abstract class Command {
    public name: string;
    public description: string;
    private _args: Command.Argument[];

    constructor(name: string, description: string, args: Command.Argument[]) {
        this.name = name;
        this.description = description;
        this._args = args;
    }

    get args() {
        return this._args.map(a => {
            const required = a.required ?? false;
            return `${required ? '<' : '['}${a.name}${required ? '>' : ']'}`;
        });
    }
}

namespace Command {
    export interface Argument {
        name: string;
        required?: boolean;
    }
}
