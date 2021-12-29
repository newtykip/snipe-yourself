# snipe-yourself

Generate a report of your osu! chokes to snipe them with ease!

[![Version](https://img.shields.io/npm/v/snipe-yourself.svg?style=for-the-badge)](https://npmjs.org/package/snipe-yourself)
[![Downloads/week](https://img.shields.io/npm/dw/snipe-yourself.svg?style=for-the-badge)](https://npmjs.org/package/snipe-yourself)
[![License](https://img.shields.io/npm/l/snipe-yourself.svg?style=for-the-badge)](https://github.com/newtykins/snipe-yourself/blob/main/package.json)

<!-- toc -->
* [snipe-yourself](#snipe-yourself)
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
snipe-yourself/1.0.0 linux-x64 node-v16.13.1
$ snipe --help [COMMAND]
USAGE
  $ snipe COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`snipe autocomplete [SHELL]`](#snipe-autocomplete-shell)
* [`snipe commands`](#snipe-commands)
* [`snipe config list`](#snipe-config-list)
* [`snipe config reset [SETTING]`](#snipe-config-reset-setting)
* [`snipe config set SETTING VALUE`](#snipe-config-set-setting-value)
* [`snipe help [COMMAND]`](#snipe-help-command)
* [`snipe profile [QUERY] [MODE]`](#snipe-profile-query-mode)

## `snipe autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ snipe autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  display autocomplete installation instructions

EXAMPLES
  $ snipe autocomplete

  $ snipe autocomplete bash

  $ snipe autocomplete zsh

  $ snipe autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v1.0.0/src/commands/autocomplete/index.ts)_

## `snipe commands`

list all the commands

```
USAGE
  $ snipe commands [-h] [-j] [--hidden] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml |  | [--csv | --no-truncate]] [--no-header | ]

FLAGS
  -h, --help         Show CLI help.
  -j, --json         display unfiltered api data in json format
  -x, --extended     show extra columns
  --columns=<value>  only show provided columns (comma-separated)
  --csv              output is csv format [alias: --output=csv]
  --filter=<value>   filter property by partial string matching, ex: name=foo
  --hidden           show hidden commands
  --no-header        hide table header from output
  --no-truncate      do not truncate output to fit screen
  --output=<option>  output in a more machine friendly format
                     <options: csv|json|yaml>
  --sort=<value>     property to sort by (prepend '-' for descending)

DESCRIPTION
  list all the commands
```

_See code: [@oclif/plugin-commands](https://github.com/oclif/plugin-commands/blob/v2.0.1/src/commands/commands.ts)_

## `snipe config list`

list all of the available settings!

```
USAGE
  $ snipe config list

DESCRIPTION
  list all of the available settings!

ALIASES
  $ snipe config view

EXAMPLES
  $ snipe config list
```

## `snipe config reset [SETTING]`

reset the config!

```
USAGE
  $ snipe config reset [SETTING]

ARGUMENTS
  SETTING  the setting to clear

DESCRIPTION
  reset the config!

ALIASES
  $ snipe config clear

EXAMPLES
  $ snipe config reset
```

## `snipe config set SETTING VALUE`

update a setting with a new value!

```
USAGE
  $ snipe config set [SETTING] [VALUE]

ARGUMENTS
  SETTING  setting to update
  VALUE    value to update the setting to

DESCRIPTION
  update a setting with a new value!

ALIASES
  $ snipe config update

EXAMPLES
  $ snipe config set client_id 11655

  $ snipe config set secret your-epic-secret

  $ snipe config set profile 16009610
```

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

## `snipe profile [QUERY] [MODE]`

rate a profile's chokes in terms of fixability

```
USAGE
  $ snipe profile [QUERY] [MODE] [-c] [-j <value>] [-m osu|mania|taiko|fruits]

ARGUMENTS
  QUERY  the profile's ID or username
  MODE   the chosen osu! gamemode

FLAGS
  -c, --console    output the results to the console
  -j, --json=path  output the results as JSON
  -m, --mode=mode  the mode to calculate for

DESCRIPTION
  rate a profile's chokes in terms of fixability

ALIASES
  $ snipe calculate

EXAMPLES
  $ snipe profile 16009610

  $ snipe profile 16009610 -j

  $ snipe profile 16009610 -c --json

  $ snipe profile "Newt x3"

  $ snipe profile
```

_See code: [dist/commands/profile/index.ts](https://github.com/newtykins/snipe-yourself/blob/v1.0.0/dist/commands/profile/index.ts)_
<!-- commandsstop -->
