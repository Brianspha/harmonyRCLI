# hrcli (Harmony Rosetta CLI Tool)

A Command Line Tool to query Harmony blockchain using Rosetta SDK.

## Project setup

```
yarn

```

## Running Localy

Running the following command should print out the available commands

1. node ./bin.js h or node ./bin.js help </br>

Which outputs the following </br>

```
Usage:  hrcli command [options]

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  mem-transaction|mt      Gets a transaction in the mempool by its Transaction Identifier.
  transaction-idents|ti   Gets all Transaction Identifiers in the mempool.
  extract-transaction|et  Gets a transaction in a block by its Transaction Identifier and Block Identifier
  block-details|bd        Gets a block by its BlockIdentifier
  account-balance|ab      Get account balance
  list-networks|ln        Lists all networks
  network-status|ns       Fetch current status harmony blockchain network
  network-options|no      Returns the version information and allowed network-specific types for a shard's
                          NetworkIdentifier on Harmony
  help|h
```

### Creating an Executable

To build an executable for the current OS simply run the following command

yarn build

This will output a file called hcli which can then be used to verify any contract deployed on harmonyone blockchain
Example.

`./hrcli list-networks`
