const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20 = artifacts.require("DummyToken.sol"); 
var evaluator = artifacts.require("Evaluator.sol");
var MyERC20 = artifacts.require("MyERC20TD.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        //await deployTDToken(deployer, network, accounts); 
        //await deployEvaluator(deployer, network, accounts);
		await rinkebyToken(deployer, network, accounts);
        //await setPermissionsAndRandomValues(deployer, network, accounts); 
        await deployRecap(deployer, network, accounts);
		await Exercices(deployer, network, accounts);  
    });
};

async function rinkebyToken(deployer, network, accounts) {
	Evaluator = await evaluator.at("0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7"); 
	TDToken = await TDErc20.at("0xc2269af51350796aF4F6D52e4736Db3A885F28D6");
	dummyToken = await TDErc20.at("0xbc3b69d1abD5A39f55a9Ba50C7a2aDd933952123");
	uniswapV2FactoryAddress = "0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f"
	wethAddress = "0xc778417e063141139fce010982780140aa0cd5ab"
}

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
	/* console.log("Exercice 6a----------------")
	await Evaluator.ex6a_getTickerAndSupply({from: account})
	const ticker = await Evaluator.readTicker(account)
	const supply = await Evaluator.readSupply(account)
	console.log("ticker " + ticker)
	console.log("supply " + supply)
	const balance_ex6a = await TDToken.balanceOf(account)
	console.log("balance ex6a : " + balance_ex6a) */

	//exo6-b
	/* console.log("Exercice 6b ------------")
	myERC20 = await MyERC20.new(ticker, ticker, supply)
	console.log("My ERC20 " + myERC20.address)
	await Evaluator.submitErc20(myERC20.address, {from: account})
	await Evaluator.ex6b_testErc20TickerAndSupply({from: account})
	const balance_ex6b = await TDToken.balanceOf(account)
	console.log("balance_ex6b " + balance_ex6b)  */

	/* TDToken 0xc2269af51350796aF4F6D52e4736Db3A885F28D6
	dummyToken 0xbc3b69d1abD5A39f55a9Ba50C7a2aDd933952123
	Evaluator 0x89a2Faa44066e94CE6B6D82927b0bbbb8709eEd7
	Init balance : 6000000000000000000
	Exercice 6a----------------
	ticker UoTH4
	supply 398390257000000000000000000
	balance ex6a : 6000000000000000000
	Exercice 6b ------------
	My ERC20 0x47720b8b92755883f1AD9DaD32616cbBD03Ba843 */

	//exo7
	console.log("Exercice 7 ------------")
	myERC20 = await MyERC20.at("0x47720b8b92755883f1AD9DaD32616cbBD03Ba843")
	await Evaluator.ex7_tokenIsTradableOnUniswap({from: account})
	const balance_ex7 = await TDToken.balanceOf(account)
	console.log("balance_ex7 " + balance_ex7)

}