const mongoose = require('mongoose');
const config = require('config');
const chalk = require('chalk');
const Item = require('../models/item');
const seedItems = require('../data/seedData.json');

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(config.get('mongoURI'));
    } catch (err) {
      console.error(chalk.red(err.message));
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const addItem = async (item) => {
  try {
    await connectDB();
    const newItem = new Item(item);
    await newItem.save();
    console.log(chalk.green('New item added!'));
  } catch (err) {
    console.error(chalk.red(err.message));
  } finally {
    await disconnectDB();
  }
};

const findItem = async (title) => {
  try {
    await connectDB();
    const search = new RegExp(title, 'i');
    const items = await Item.find({ title: search });
    if (items.length === 0) {
      console.log(chalk.yellow('No items found.'));
    } else {
      console.log(chalk.cyan.bold('--- Found Items ---'));
      items.forEach(item => {
        console.log(`
  ${chalk.bold('ID:')} ${item._id}
  ${chalk.bold('title:')} ${item.title}
  ${chalk.bold('Description:')} ${item.description}
        `);
      });
       console.log(chalk.cyan.bold('-------------------'));
    }
  } catch (err) {
    console.error(chalk.red(err.message));
  } finally {
    await disconnectDB();
  }
};

const updateItem = async (id, updatedItem) => {
    try {
        await connectDB();
        const item = await Item.findByIdAndUpdate(id, updatedItem, { new: true });
        if (!item) {
            console.log(chalk.yellow('Item not found with that ID.'));
        } else {
            console.log(chalk.green('Item updated successfully:'), item);
        }
    } catch (err) {
        console.error(chalk.red(err.message));
    } finally {
        await disconnectDB();
    }
};

const removeItem = async (id) => {
    try {
        await connectDB();
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            console.log(chalk.yellow('Item not found with that ID.'));
        } else {
            console.log(chalk.red('Item removed successfully:'), item);
        }
    } catch (err) {
        console.error(chalk.red(err.message));
    } finally {
        await disconnectDB();
    }
};

const seedData = async () => {
  try {
    await connectDB();
    console.log(chalk.yellow('Clearing existing data...'));
    await Item.deleteMany({});
    console.log(chalk.cyan('Seeding the database...'));
    await Item.insertMany(seedItems);
    console.log(chalk.green.bold(`Database seeded with ${seedItems.length} items!`));
  } catch (err) {
    console.error(chalk.red(err.message));
  } finally {
    await disconnectDB();
  }
};

const deleteAllData = async () => {
  try {
    await connectDB();
    await Item.deleteMany({});
    console.log(chalk.red.bold('All data successfully deleted from the collection.'));
  } catch (err) {
    console.error(chalk.red(err.message));
  } finally {
    await disconnectDB();
  }
};

module.exports = { addItem, findItem, updateItem, removeItem, seedData, deleteAllData };