const axios = require("axios").default;
const ora = require("ora");
const { program } = require("commander");
var pretty = require("js-object-pretty-print").pretty;
const chalk = require("chalk");
const inquirer = require("inquirer");
const shards = [
  "https://rosetta.s0.b.hmny.io",
  "https://rosetta.s1.b.hmny.io",
  "https://rosetta.s2.b.hmny.io",
  "https://rosetta.s3.b.hmny.io",
];
function getTransactionsFromPool() {
  var questions = [
    {
      type: "list",
      name: "chain",
      message: "What chain would you like to query?",
      choices: ["Testnet", "Mainnet"],
      filter: function (val) {
        return val;
      },
    },
    {
      type: "list",
      name: "shardNo",
      message: "What shard number would you like to connect to?",
      choices: ["0", "1", "2", "3"],
      filter: function (val) {
        return val.toLowerCase();
      },
    },
    {
      type: "list",
      name: "isBeacon",
      message: "Is this a beacon chain?",
      choices: ["true", "false"],
      filter: function (val) {
        return val;
      },
    },
  ];
  inquirer.prompt(questions).then((options) => {
    const spinner = ora(
      `Fetching all Transaction Identifiers for shard ${options.shardNo} on the Harmony Blockchain Network....\n`
    ).start();
    axios({
      method: "POST",
      url: shards[options.shardNo]+"/mempool",
      data: {
        network_identifier: {
          blockchain: "Harmony",
          network: options.chain,
          sub_network_identifier: {
            network: "shard " + options.shardNo,
            metadata: {
              is_beacon: options.isBeacon === "true" ? true : false,
            },
          },
        },
        metadata: {},
      },
    })
      .then((results) => {
        console.log("results: ", results.data);
        if (results.data.hasOwnProperty("transaction_identifiers")) {
          spinner.succeed(
            `Fetching all Transaction Identifiers for shard ${options.shardNo} on the Harmony Blockchain Network....\n`
          );
          console.log(chalk.yellow("Transaction Identifiers JSON\n"));
          console.log(chalk.greenBright(pretty(results.data)));
        } else {
          spinner.succeed(
            "Couldnt connect to the Rosetta SDK Servers please try again\n"
          );
        }
        spinner.stop();
        process.exit(0);
      })
      .catch((error) => {
        console.log("error: ", error);
        spinner.succeed(
          "Couldnt connect to the Rosetta SDK Servers please try again\n"
        );
        spinner.stop();
        process.exit(0);
      });
  });
}
getTransactionsFromPool();
