export interface Command {
    name: string;
    description: string;
    options: any[];
    execute: (interaction: any) => void;
}

export class CommandBot {
    commands: Command[];

    constructor() {
        this.commands = [];
    }

    setCommandBuild(commands: Command[] ) {
        this.commands.push(...commands)
    }

    get getCommands() {
        return this.commands;
    }
}