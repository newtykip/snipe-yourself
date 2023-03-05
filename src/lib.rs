use rusty_yaml::Yaml;
use std::{fs, path::PathBuf};

pub fn config_path() -> PathBuf {
    return dirs::config_dir().unwrap().join("snipe-yourself.yml");
}

pub fn read_config() -> Yaml {
    return Yaml::from(fs::read_to_string(config_path()).unwrap().as_str());
}
