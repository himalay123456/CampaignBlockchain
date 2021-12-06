import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),
'0xaCD8B0867504cf10EE55CD043b7b534D37857A43'
)

export default instance;