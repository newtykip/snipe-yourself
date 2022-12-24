use clap::Parser;
use owo_colors::OwoColorize;
use std::{fs, path::PathBuf};
use titlecase::titlecase;

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

fn get_path() -> PathBuf {
    return dirs::config_dir().unwrap().join("snipe-yourself.yml");
}

pub(crate) fn list() {
    let config = rusty_yaml::Yaml::from(fs::read_to_string(get_path()).unwrap().as_str());

    for key in config.get_section_names().unwrap() {
        let mut value = config.get_section(&key).unwrap().to_string();

        if value == "~" {
            value = String::from("[N/A]").red().to_string();
        } else if key == "client_secret" {
            value = String::from("[redacted]").red().to_string();
        } 

        println!("{}: {}", titlecase(&key.replace("_", " ")).bold(), value);
    }
}
