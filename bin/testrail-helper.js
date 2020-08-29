#!/usr/bin/env node
const program = require("commander");

program
  .command("init [path]")
  .description("Creates dummy config in current dir or [path]")
  .action(require("../lib/command/init"));

program
  .command("run")
  .description("Process Allure reports and send results to TestRail")

  // Helper options
  .option("-d, --dir <dir>", "Directory to scan")
  .option("-c, --config <config>", "JSON or JS file with the configuration")
  .option("-h, --host <host>", "URL of the host")
  .option("-u, --user <user>", "Username")
  .option("-p, --password <password>", "Password")
  .option("-s, --suite <suite>", "Suite ID")
  .option("-pr, --project <project>", "Project ID")
  .option("-pl, --plan <plan>", "Plan ID")

  // Execute
  .action(require("../lib/command/run"));

program
  .command("debug")
  .description(
    "Print debugging information with preceeding DEBUG=* or DEBUG=*TestRail* followed by the command."
  );

if (process.argv.length <= 2) {
  program.outputHelp();
}

program.parse(process.argv);
