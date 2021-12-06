import Web3 from 'web3';

let web3;
if(typeof window !== 'undefined' && typeof window.web3 !== 'undefined')
{
    // We are in the browser
    web3 = new Web3(window.web3.currentProvider);
}else{
    // We are in the server or user has no metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/08c7635adbcd4dfaaccdf850a5d8b782'
    )
    web3 = new Web3(provider);
}
export default web3;