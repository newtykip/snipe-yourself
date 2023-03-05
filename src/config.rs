use clap::{Args, Parser};
use owo_colors::OwoColorize;
use regex::Regex;
use snipe_yourself::{config_path, read_config};
use std::{
    fs::{self, File},
    io::Write,
    ops::Deref,
};
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
    Set(SetArgs),

    /// Reset the config to the default values
    Reset,
}

#[derive(Args, Debug)]
pub(crate) struct SetArgs {
    setting: String,
    value: Option<String>,
}

fn ensure_config_exists() {
    let path = config_path();

    if !path.exists() {
        let mut file = File::create(path).unwrap();

        file.write(DEFAULT_CONFIG).unwrap();
        drop(file);
    }
}

fn format_key(key: String) -> String {
    titlecase(&key.replace("_", " "))
}

pub(crate) fn list() {
    ensure_config_exists();

    let config = read_config();

    for key in config.get_section_names().unwrap() {
        let mut value = config.get_section(&key).unwrap().to_string();

        if value == "~" {
            value = String::from("[N/A]").red().to_string();
        } else if key == "client_secret" {
            value = String::from("[redacted]").red().to_string();
        }

        println!("{}: {}", format_key(key).bold(), value);
    }
}

pub(crate) fn reset() {
    ensure_config_exists();

    // Ask for confirmation first (:
    let confirmed = requestty::prompt_one(
        requestty::Question::confirm("proceed")
            .message("Are you sure you would like to reset your config?")
            .build(),
    )
    .unwrap()
    .as_bool()
    .unwrap();

    if confirmed {
        let mut file = fs::OpenOptions::new()
            .write(true)
            .truncate(true)
            .open(config_path())
            .unwrap();

        file.write(DEFAULT_CONFIG).unwrap();
        drop(file);

        println!("{}", "Config reset!".green())
    } else {
        println!("{}", "Reset cancelled!".green())
    }
}

pub(crate) fn set(args: SetArgs) {
    let config = read_config();
    let mut option = args.setting.clone();

    // Try and figure out what setting the user was trying to update
    if !config.has_section(&option) {
        let sections = config.get_section_names().unwrap();
        let settings = sections.iter().map(|x| x.deref()).collect::<Vec<&str>>();
        let (matched, _) = rust_fuzzy_search::fuzzy_search_best_n(&option, &settings, 1)[0];

        let confirmed =
            requestty::prompt_one(requestty::Question::confirm("proceed").message(format!(
                "Setting \"{}\" does not exist. Did you mean {}?",
                &option,
                format_key(matched.to_string())
            )))
            .unwrap()
            .as_bool()
            .unwrap();

        if confirmed {
            option = matched.to_string();
        } else {
            std::process::exit(1);
        }
    }

    // Update the option
    let re = Regex::new(format!("{option}:.*").as_str()).unwrap();
    let original_content = config.to_string();
    let new_value = args.value.unwrap_or(String::new());
    let new_contents = re.replace(
        &original_content.as_str(),
        format!("{option}: {}", new_value),
    );

    let mut file = fs::OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(config_path())
        .unwrap();

    file.write_all(new_contents.as_bytes()).unwrap();
    file.flush().unwrap();

    println!(
        "Successfully updated {} to {}!",
        format_key(option).bold(),
        if new_value == "" {
            String::from("[N/A]").red().bold().to_string()
        } else {
            new_value.bold().to_string()
        }
    );
}
