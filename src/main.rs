use clap::Parser;

mod config;

#[derive(Parser, Debug)]
#[clap(about, author, version)]
struct Value {
    #[clap(subcommand)]
    command: Command,
}

#[derive(Parser, Debug)]
enum Command {
    /// View or modify the config
    Config(config::Command),
}

fn main() {
    let command = Value::parse().command;

    match command {
        Command::Config(config::Command { subcommand }) => match subcommand {
            config::Subcommand::List => println!("list!"),
            config::Subcommand::Set => println!("set"),
            config::Subcommand::Reset => println!("reset"),
        },
    }
}
