use clap::Parser;

#[derive(Parser, Debug)]
pub(crate) struct Command {
    #[clap(subcommand)]
    pub subcommand: Subcommand,
}

#[derive(Parser, Debug)]
pub(crate) enum Subcommand {
    /// View the current config
    List,

    /// Update the current config
    Set,

    /// Reset the config to the default values
    Reset,
}
