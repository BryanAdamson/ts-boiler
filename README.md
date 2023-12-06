# TS boiler
This is a Typescript boiler plate using expressJs, MongoDB, and Jest for testing.

## Getting Started
#### First Clone the project from GitHub with:
    git clone https://github.com/BryanAdamson/ts-boiler.git
#### Now open the cloned project in vscode or any IDE of your choice and run:
    npm install
#### Create a .env file
Before you can run the project locally you need to create a .env file that will be placed at the root folder, also at the root of the project you should see a .env.example file, this file should give you a template of what the values are meant to be in the .env file.

#### Now you should be able to run the project locally on your computer, by running:
    npm run dev
## Project Folder Architecture
The entry point for this project is in the /src. The project also uses a Model-Controller-Route Based Architecture whereby you have model, controller, and route files having similar naming conventions. For example:
```
Model:          User.ts,
Controller:     UserController.ts
Route:          UserRoute.ts
```
Also, note that this code based is primarily function based, and uses camelCase predominantly throughout. We use PascalCase for model, interface, type, and enum definitions.
## /src
### index.ts
This is where the server logic is. Essentially, the entryway for the application.

### /configs
This folder holds configuration logic for most third-party packages. Each package gets its own configuration file. It also holds the App configuration.

### /controllers
The controllers for the application exist here. We try to make sure to follow a logical grouping for the different functions.

This means, say we have a User model and a Car model. The Users may have multiple Cars.   
The ```getAllUserCars``` function (which retrieves all cars tied to a specific user) will exist in the UserController.ts, while the ```getAllCars``` function (which retrieves all cars in the system) will exist in the CarController.ts.

### /enums
Holds enum declarations. We keep enums in separate files.

### /interfaces
Holds interface declarations. We keep interfaces in separate files.

### /middleware
This folder holds any middleware functions you want ran before the request hits your controller. For example, have an ```authenticate.ts``` file that holds a middleware function that helps us pass information about the current user.

### /migrations
This is where migration files are kept. Migrations are necessary to keep the db up to date. This project uses the ```ts-migrate-mongoose``` package.   
  
To create a migration, run:  

    migrate create <name of migrartion>  
To run a migration, run:

    migrate up <name of migrartion>  
To reverse a migration, run:

    migrate down <name of migrartion>



### /models
Model files can get a little complicated, as they hold type definitions for the model being defined.  
They may also hold model-specific functions (i.e. virtual field definitions, getters, setters, etc.), if necessary.

### /routes
These are the route declarations. This is where the middlewares you may have defined come into play. You may also use validation/sanitization packages. We have the ```express-validator``` package installed to aid validation/sanitization, and the validation middleware to handle validation errors.

### /utils
This is where most miscellaneous code goes. There are 2 major files in this folder, namely:
#### constants.ts
Holds global constants to be used throughout the system.
#### helpers.ts
Holds globally used functions.

### /views
This is where ejs templates go.

## /tests
The tests for this project go here. This project uses Jest to handle Unit/Integration tests. The database connection logic to be used during tests is in the index.ts file.  

To run your tests, run:

    npm run test
