# Tyche
Decentralised voting system based on Ethereum.
## Prerequisites
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [Truffle](https://truffleframework.com/)
## Setup
#### Download source code
```
git clone https://github.com/Bo-Ye/tyche.git
```
#### Deploy contracts
Go to project root directory and run
```
truffle develop
```
Deploy contracts
```
migrate --reset
```
#### Launch web server
Install packages
```
npm install
```
Launch webpack-dev-server
```
./node_modules/.bin/webpack-dev-server --mode development
```
## Access webpage
**http://localhost:3000**