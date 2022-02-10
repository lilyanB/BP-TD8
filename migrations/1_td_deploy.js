const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var MyERC20 = artifacts.require("MyERC20TD.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        await setPermissionsAndRandomValues(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts);
		await Exercices(deployer, network, accounts);  
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-AMM-101","TD-AMM-101",web3.utils.toBN("20000000000000000000000000000"))
	dummyToken = await ERC20.new("dummyToken", "DTK", web3.utils.toBN("2000000000000000000000000000000"))
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab"
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, dummyToken.address, uniswapV2FactoryAddress, wethAddress)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	randomSupplies = []
	randomTickers = []
	for (i = 0; i < 20; i++)
		{
		randomSupplies.push(Math.floor(Math.random()*1000000000))
		randomTickers.push(Str.random(5))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomTickers)
	console.log(randomSupplies)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomTickersAndSupply(randomSupplies, randomTickers);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("dummyToken " + dummyToken.address)
	console.log("Evaluator " + Evaluator.address)
}


async function Exercices(deployer, network, accounts) {
	account = accounts[0];
	getBalance = await TDToken.balanceOf(account);
	console.log("Init balance : " + getBalance.toString());

	//exo6-a
	console.log("Exercice 6a")
	await Evaluator.ex6a_getTickerAndSupply({from: account})
	const ticker = await Evaluator.readTicker(account)
	const supply = await Evaluator.readSupply(account)
	console.log("ticker " + ticker)
	console.log("supply " + supply)
	const balance_ex6a = await TDToken.balanceOf(account)
	console.log("balance ex6a : " + balance_ex6a)

	//exo6-b
	console.log("Exercice 6b")
	MyERC20 = await MyERC20.new(ticker, ticker, supply)
	console.log("My ERC20 " + MyERC20.address)
	await Evaluator.submitErc20(MyERC20.address, {from: account})
	await Evaluator.ex6b_testErc20TickerAndSupply({from: account})
	const balance_ex6b = await TDToken.balanceOf(account)
	console.log("balance_ex6b " + balance_ex6b)

}