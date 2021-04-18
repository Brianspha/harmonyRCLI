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
function getNetworkStatus() {
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
      `Fetching network status for a shard ${options.shardNo} on the Harmony Blockchain Network....\n`
    ).start();
    axios({
      method: "POST",
      url: shards[options.shardNo] + "/network/status",
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
        if (results.data.hasOwnProperty("sync_status")) {
          spinner.succeed(
            `Fetching network status for a shard ${options.shardNo} on the Harmony Blockchain Network....\n`
          );

          var headingsBlockIdentifiers = ["index", "hash"];
          var headingsBlockTimeStamp = ["index", "timeStamp"];
          var headingsGenesisBlockIdentifier = ["index", "hash"];
          var headingsSyncStatus = [];
          var headingsPeers = ["index", "peerId"];
          var headingsPeersTopics = ["peerId", "topic"];
          var statusValues = [];
          for (var key in results.data.sync_status) {
            if (
              results.data.sync_status.hasOwnProperty(key) &&
              !headingsSyncStatus.includes(key)
            ) {
              headingsSyncStatus.push(key);
            }
          }

          var tableBlockIdentifiers = new Table({
            head: headingsBlockIdentifiers,
          });
          var tableBlockTimeStamp = new Table({
            head: headingsBlockTimeStamp,
          });
          var tableGenesisBlockIdentifier = new Table({
            head: headingsGenesisBlockIdentifier,
          });
          var tableSyncStatus = new Table({
            head: headingsSyncStatus,
          });
          var tablePeers = new Table({
            head: headingsPeers,
          });
          var tablePeersTopics = new Table({
            head: headingsPeersTopics,
          });
          tableBlockTimeStamp.push([
            results.data.current_block_identifier.index,
            results.data.current_block_identifier.hash,
          ]);
          tableBlockIdentifiers.push([
            results.data.current_block_identifier.index,
            results.data.current_block_identifier.hash,
          ]);
          tableGenesisBlockIdentifier.push([
            results.data.current_block_identifier.index,
            results.data.current_block_identifier.hash,
          ]);
          var tempValues = [];
          for (var key in headingsSyncStatus) {
            console.log(
              "key: ",
              key,
              " results.data.sync_status[headingsSyncStatus[key]]: ",
              results.data.sync_status[headingsSyncStatus[key]]
            );
            tempValues.push(results.data.sync_status[headingsSyncStatus[key]]);
          }

          tableSyncStatus.push(tempValues);
          results.data.peers.map((peer, index) => {
            tablePeers.push([index, peer.peer_id]);
            peer.metadata.topics.map((topic) => {
              tablePeersTopics.push([peer.peer_id, topic]);
            });
          });
          console.log(chalk.yellow("Current Block Indentifier\n"));
          console.log(tableBlockIdentifiers.toString());
          console.log(chalk.yellow("\nCurrent Block Time Stamp"));
          console.log(tableBlockTimeStamp.toString());
          console.log(chalk.yellow("\nGenesis Block Identifier"));
          console.log(tableGenesisBlockIdentifier.toString());
          console.log(chalk.yellow("\nSync Status"));
          console.log(tableSyncStatus.toString());
          console.log(chalk.yellow("\nPeers"));
          console.log(tablePeers.toString());
          console.log(chalk.yellow("Peers Topics Metadata"));
          console.log(tablePeersTopics.toString());
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

getNetworkStatus();
