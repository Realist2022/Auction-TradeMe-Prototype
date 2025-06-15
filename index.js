#!/usr/bin/env node
require('dotenv').config(); 
const { Command } = require('commander');
const { default: inquirer } = require('inquirer');
const chalk = require('chalk');
const figlet = require('figlet');
const { addItem, findItem, updateItem, removeItem, seedData, deleteAllData } = require('./commands/crud');

const program = new Command();

// Display a cool as figlet header
console.log(chalk.cyan(figlet.textSync('CRUD CLI', { horizontalLayout: 'full' })));

program
  .version('2.0.0')
  .description('An interactive CLI tool to manage a MongoDB database');

// --- Add Command ---
program
  .command('add')
  .alias('a')
  .description('Add a new auction item')
  .action(() => {
    const questions = [
      {
        type: 'input',
        name: 'title', 
        message: 'Item Title:',
      },
      {
        type: 'input',
        name: 'description',
        message: 'Item Description:',
      },
      {
        type: 'number', 
        name: 'start_price',
        message: 'Starting Price:',
      },
      {
        type: 'number', 
        name: 'reserve_price',
        message: 'Reserve Price:',
      }
    ];
    inquirer.prompt(questions).then(answers => {
      // Basic validation
      if (isNaN(answers.start_price) || isNaN(answers.reserve_price)) {
          console.log(chalk.red('Error: Prices must be valid numbers.'));
          return;
      }
      addItem(answers);
    });
  });

// --- Find Command ---
program
  .command('find')
  .alias('f')
  .description('Find an item')
  .action(() => {
    const question = [{ type: 'input', name: 'name', message: 'Enter the name of the item to find:' }];
    inquirer.prompt(question).then(answer => findItem(answer.name));
  });

// --- Update Command ---
program
  .command('update')
  .alias('u')
  .description('Update an item')
  .action(() => {
    const questions = [
      { type: 'input', name: 'id', message: 'Enter the ID of the item to update:' },
      { type: 'input', name: 'name', message: 'New Item Name (leave blank to keep current):' },
      { type: 'input', name: 'description', message: 'New Item Description (leave blank to keep current):' },
    ];
    inquirer.prompt(questions).then(answers => {
      const { id, ...rest } = answers;
      const updatedData = {};
      if (rest.name) updatedData.name = rest.name;
      if (rest.description) updatedData.description = rest.description;
      if (Object.keys(updatedData).length === 0) {
        console.log(chalk.yellow('No new data provided. Exiting update.'));
        return;
      }
      updateItem(id, updatedData);
    });
  });

// --- Remove Command ---
program
  .command('remove')
  .alias('r')
  .description('Remove an item')
  .action(() => {
    const questions = [
      { type: 'input', name: 'id', message: 'Enter the ID of the item to remove:' },
      { type: 'confirm', name: 'confirm', message: 'Are you sure you want to remove this item?', default: false }
    ];
    inquirer.prompt(questions).then(answers => {
      if(answers.confirm){
        removeItem(answers.id);
      } else {
        console.log(chalk.yellow('Removal cancelled.'));
      }
    });
  });

  program
  .command('seed')
  .description('Populate the database with initial sample data')
  .action(() => {
    const question = [
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.yellow('This will delete all existing data and seed the database. Are you sure?'),
        default: false
      }
    ];
    inquirer.prompt(question).then(answers => {
      if (answers.confirm) {
        seedData();
      } else {
        console.log(chalk.blue('Seed operation cancelled.'));
      }
    });
  });

program
  .command('delete-all')
  .description('Delete ALL data from the collection')
  .action(() => {
    const question = [
      {
        type: 'confirm',
        name: 'confirm',
        message: chalk.red.bold('DANGER: This will permanently delete all items in the collection. Are you absolutely sure?'),
        default: false
      }
    ];
    inquirer.prompt(question).then(answers => {
      if (answers.confirm) {
        deleteAllData();
      } else {
        console.log(chalk.blue('Delete operation cancelled.'));
      }
    });
  });

program.parse(process.argv);