const { program } = require("commander");
const ora = require("ora");
const fs = require("fs");
const path = require("path");
const colors = require("colors");
// node cachemanager
var Cache = require("file-system-cache").default;
const { version } = require("../../package.json");
program
  .version(version)
  .command(
    "mem-transaction",
    "Gets a transaction in the mempool by its Transaction Identifier.",
    { executableFile: "./cli/commands/memory-pool-transaction.js" }
  )
  .alias("mt")
  .command(
    "transaction-idents",
    "Gets all Transaction Identifiers in the mempool.",
    { executableFile: "./cli/commands/memory-pool.js" }
  )
  .alias("ti")
  .command(
    "extract-transaction",
    "Gets a transaction in a block by its Transaction Identifier and Block Identifier",
    { executableFile: "./cli/commands/get-transaction.js" }
  )
  .alias("et")
  .command("block-details", "Gets a block by its BlockIdentifier", {
    executableFile: "./cli/commands/get-block.js",
  })
  .alias("bd")
  .command("account-balance", "Get account balance", {
    executableFile: "./cli/commands/account-balance.js",
  })
  .alias("ab")
  .command("list-networks", "Lists all networks", {
    executableFile: "./cli/commands/list-networks.js",
  })
  .alias("ln")
  .command(
    "network-status",
    "Fetch current status harmony blockchain network",
    { executableFile: "./cli/commands/network-status.js" }
  )
  .alias("ns")
  .command(
    "network-options",
    "Returns the version information and allowed network-specific types for a shard's NetworkIdentifier on Harmony",
    { executableFile: "./cli/commands/network-options.js" }
  )
  .alias("no")
  .command(
    "help",
    "outputs all commands",
    { executableFile: "./cli/commands/help.js" },
    { isDefault: true }
  )
  .alias("h")
  .on("command:*", function (operands) {
    console.error(`error: unknown commands '${operands[0]}'`);
    const availableCommands = program.commands.map((cmd) => cmd.name());
    mySuggestBestMatch(operands[0], availableCommands);
    // console.log(program.helpInformation());
    process.exit(1);
  })
  .usage("hrcli command [options]");

function mySuggestBestMatch(arg, commands) {
  var message = `Did you mean?\n\n`;
  var found = false;
  commands.map((command) => {
    if (command.includes(arg)) {
      message += command + "\n";
      found = true;
    }
  });
  if (found) {
    console.log(message);
  } else {
    console.log(program.helpInformation());
  }
}
module.exports = { program };
