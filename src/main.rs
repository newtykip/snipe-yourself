use clap::Parser;

mod config;
mod profile;

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

    /// Check a profile for snipable scores
    Profile,
}

fn main() {
    let command = Value::parse().command;

    match command {
        Command::Config(config::Command { subcommand }) => match subcommand {
            config::Subcommand::List => config::list(),
            config::Subcommand::Set => println!("set"),
            config::Subcommand::Reset => config::reset(),
        },

        Command::Profile => profile::execute(),
    }
}
