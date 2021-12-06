const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
})


describe('Campaign', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    it('Checking Manager', async() => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    })
    it('Contribute', async() => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: '110'
        })
        const address = await campaign.methods.approvers(accounts[1]).call();
        assert(address);
    })
    it('Requires a minimum contribution', async() => {
        try{
            await campaign.methods.contribute().send({
                from: accounts[1],
                value: '0'
            })
            assert(false);
        }catch(err)
        {
            assert(err);
        }
    })

    it('Create the request', async() => {
        await campaign.methods.
            createRequest('Buy Batteries', accounts[2], '100',).send({
                from: accounts[0],
                gas: '1000000'
            })
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy Batteries', request.description)
    })

    it('processes the request', async() => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods.
            createRequest('Buy Batteries', accounts[1], web3.utils.toWei('5', 'ether')).send({
                from: accounts[0],
                gas: '1000000'
        })
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })
        let oldBal = await web3.eth.getBalance(accounts[1]);
        oldBal = web3.utils.fromWei(oldBal, 'ether');
        oldBal = parseFloat(oldBal);
        console.log('oldBalance', oldBal);
        

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        })

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);
        console.log('newBalance', balance);
        assert(balance > 104)


    })
})