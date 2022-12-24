use clap::Parser;
use owo_colors::OwoColorize;
use std::{fs::{self, File}, path::PathBuf, io::Write};
use titlecase::titlecase;

const DEFAULT_CONFIG: &[u8] = b"client_id: 
client_secret: 
profile_id: ";

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

fn ensure_config_exists() {
    let path = get_path();

    if !path.exists() {
        let mut file = File::create(path).unwrap();

        file.write(DEFAULT_CONFIG).unwrap();
        drop(file);
    }
}

pub(crate) fn list() {
    ensure_config_exists();

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

pub(crate) fn reset() {
    ensure_config_exists();

    // Ask for confirmation first (:
    let confirmed = requestty::prompt_one(requestty::Question::confirm("proceed")
    .message("Are you sure you would like to reset your config?")
    .build()).unwrap().as_bool().unwrap();

    if confirmed {
        let mut file = fs::OpenOptions::new().write(true).truncate(true).open(get_path()).unwrap();

        file.write(DEFAULT_CONFIG).unwrap();
        drop(file);

        println!("{}", "Config reset!".green())
    } else {
        println!("{}", "Reset cancelled!".green())
    }
}
