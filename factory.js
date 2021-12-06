import web3 from './web3';
import CampaignFactory from './CampaignFactory.json';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),
'0x9c3D9eD6963B18B8dBAA70be2B50F25747Bf39DD'
)

// console.log(instance)

export default instance;