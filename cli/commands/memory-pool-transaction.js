const axios = require("axios").default;
const ora = require("ora");
const { program } = require("../config/config");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
var Table = require("cli-table");
var pretty = require('js-object-pretty-print').pretty;

const shards = [
  "https://rosetta.s0.b.hmny.io",
  "https://rosetta.s1.b.hmny.io",
  "https://rosetta.s2.b.hmny.io",
  "https://rosetta.s3.b.hmny.io",
];
function getBlock() {
  var questions = [
    {
      type: "input",
      name: "transaction_identifier",
      message: "Please the transaction identifer hash?",
      validate: function (val) {
        if (val) {
          return true;
        } else {
          return "Please enter a transaction identifier hash!!";
        }
      },
    },
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
      `Fetching transaction details from mem-pool for ${options.transaction_identifier} on the Harmony Blockchain Network results will be shown as JSON....\n`
      ).start();
    axios({
      method: "POST",
      url: shards[options.shardNo] + "/mempool/transaction",
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
        transaction_identifier: {
          hash: options.transaction_identifier,
        },
      },
    })
      .then((results) => {
        console.log("results: ", results.data);
        if (results.data.hasOwnProperty("transaction")) {
          spinner.succeed(
            `Fetching transaction details from mem-pool for ${options.transaction_identifier} on the Harmony Blockchain Network results will be shown as JSON....\n`
          );
          console.log(chalk.yellow("Current Transaction Data JSON\n"));
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
      //  console.log("error: ", error);
        spinner.succeed(
          "Couldnt connect to the Rosetta SDK Servers please try again or Transaction or Staking Transaction was not found\n"
        );
        spinner.stop();
        process.exit(0);
      });
  });
}

getBlock();
