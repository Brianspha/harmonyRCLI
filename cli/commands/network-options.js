const axios = require("axios").default;
const ora = require("ora");
const { program } = require("../config/config");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
var Table = require("cli-table");

const shards = [
  "https://rosetta.s0.b.hmny.io",
  "https://rosetta.s1.b.hmny.io",
  "https://rosetta.s2.b.hmny.io",
  "https://rosetta.s3.b.hmny.io",
];
function getNetworkOptions() {
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
        `Fetching network options for a shard ${options.shardNo} on the Harmony Blockchain Network....\n`
        ).start();
    axios({
      method: "POST",
      url: shards[options.shardNo] + "/network/options",
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
        if (results.data.hasOwnProperty("version")) {
          spinner.succeed(
            `Fetching network options for a shard ${options.shardNo} on the Harmony Blockchain Network....\n`
            );

          var headingsVersion = [];
          var headingsOperationStatus = [];
          var headingsOperationTypes = ["index", "Type"];
          var headingsErrors = [];
          var headingsHistoricalBalanceLookup = ["index", "value"];
          var statusValues = [];
          results.data.allow.operation_statuses.map((status) => {
            for (var key in status) {
              if (
                status.hasOwnProperty(key) &&
                !headingsOperationStatus.includes(key)
              ) {
                headingsOperationStatus.push(key);
              }
            }
          });

          results.data.allow.errors.map((error) => {
            for (var key in error) {
              if (error.hasOwnProperty(key) && !headingsErrors.includes(key)) {
                headingsErrors.push(key);
              }
            }
          });
          for (var key in results.data.version) {
            headingsVersion.push(key);
          }
          var tableVersion = new Table({
            head: headingsVersion,
          });
          var tableOperationTypes = new Table({
            head: headingsOperationTypes,
          });
          var tableOperationStatus = new Table({
            head: headingsOperationStatus,
          });
          var tableErrors = new Table({
            head: headingsErrors,
          });
          var tableHistoricalBalanceLookup = new Table({
            head: headingsHistoricalBalanceLookup,
          });
          results.data.allow.errors.map((error) => {
            var temp = [];
            for (var key in headingsErrors) {
              temp.push(error[headingsErrors[key]]);
            }
            tableErrors.push(temp);
          });
          results.data.allow.operation_statuses.map((status, index) => {
            var temp = [];
            for (var key in headingsOperationStatus) {
              temp.push(status[headingsOperationStatus[key]]);
            }
            tableOperationStatus.push(temp);
          });
          tableVersion.push(results.data.version);
          tableHistoricalBalanceLookup.push([
            0,
            results.data.allow.historical_balance_lookup,
          ]);
          results.data.allow.operation_types.map((opType, index) => {
            tableOperationTypes.push([index, opType]);
          });
          console.log(chalk.yellow("Roesetta Verison\n"))
          console.log(tableVersion.toString());
          console.log(chalk.yellow("\nOperation Status"))
          console.log(tableOperationStatus.toString());
          console.log(chalk.yellow("\nOperation Types"))
          console.log(tableOperationTypes.toString());
          console.log(chalk.yellow("\nPossible Errors"))
          console.log(tableErrors.toString());
          console.log(chalk.yellow("\nHistorical Balance Lookup Support"))
          console.log(tableHistoricalBalanceLookup.toString());
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

getNetworkOptions();
