oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g snipe-yourself
$ snipe COMMAND
running command...
$ snipe (--version)
snipe-yourself/0.0.0 linux-x64 node-v16.13.1
$ snipe --help [COMMAND]
USAGE
  $ snipe COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`snipe help [COMMAND]`](#snipe-help-command)
* [`snipe plugins`](#snipe-plugins)
* [`snipe plugins:inspect PLUGIN...`](#snipe-pluginsinspect-plugin)
* [`snipe plugins:install PLUGIN...`](#snipe-pluginsinstall-plugin)
* [`snipe plugins:link PLUGIN`](#snipe-pluginslink-plugin)
* [`snipe plugins:uninstall PLUGIN...`](#snipe-pluginsuninstall-plugin)
* [`snipe plugins update`](#snipe-plugins-update)

## `snipe help [COMMAND]`

Display help for snipe.

```
USAGE
  $ snipe help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for snipe.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `snipe plugins`

List installed plugins.

```
USAGE
  $ snipe plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ snipe plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `snipe plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ snipe plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ snipe plugins:inspect myplugin
```

## `snipe plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ snipe plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ snipe plugins add

EXAMPLES
  $ snipe plugins:install myplugin 

  $ snipe plugins:install https://github.com/someuser/someplugin

  $ snipe plugins:install someuser/someplugin
```

## `snipe plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ snipe plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ snipe plugins:link myplugin
```

## `snipe plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ snipe plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snipe plugins unlink
  $ snipe plugins remove
```

## `snipe plugins update`

Update installed plugins.

```
USAGE
  $ snipe plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
