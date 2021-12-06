import web3 from './web3';
import CompiledCampaign from './Campaign.json';

const instance = (address) => new web3.eth.Contract(JSON.parse(CompiledCampaign.interface),
    address
)

// console.log(instance)

export default instance;