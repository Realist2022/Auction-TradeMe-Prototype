# Auction-TradeMe-Prototype

This is a command-line interface (CLI) tool for managing auction item data in a MongoDB database. It allows you to add, find, update, remove, seed, and delete auction data interactively.

## Prerequisites

- [Node.js](https://nodejs.org/)
- A running MongoDB instance (local or on [Atlas](https://www.mongodb.com/cloud/atlas))

## Installation and Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/my-interactive-cli.git](https://github.com/your-username/my-interactive-cli.git)
    ```

2.  **Navigate to the project directory:**
    ```sh
    cd my-interactive-cli
    ```

3.  **Install the dependencies:**
    ```sh
    npm install
    ```

4.  **Configure the database connection:**
    Open the `config/default.json` file and make sure the `mongoURI` points to your MongoDB instance.

5.  **Link the command:**
    This makes the `conf` command available globally on your machine.
    ```sh
    npm link
    ```

## Usage

Here are the available commands:

-   `conf add` - Interactively add a new auction item.
-   `conf find` - Interactively find an item by its title.
-   `conf update` - Interactively update an item by its ID.
-   `conf remove` - Interactively remove an item by its ID.

### Development Commands

-   `conf seed` - **Deletes all data** and populates the database with sample auction items.
-   `conf delete-all` - **Deletes all data** from the items collection.
