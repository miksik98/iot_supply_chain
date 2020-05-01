const { composeAPI } = require('@iota/core');
const { asciiToTrytes } = require('@iota/converter')
const { createChannel, createMessage, mamAttach } = require('@iota/mam.js');
const product = require('./product');
const Product = product.Product;
const { generateSeed, security, globalProvider, mode } = require('./utils')
const { createProduct } = require('./db/query');

function create_product(companyName, messageRootID)
{
    var prompt = require('prompt');

    var prompt_attributes = [
        {name: 'type',},
        {name: 'ID',},
        {name: 'description',},
        {name: 'productionLine',},
        {name: 'productionBatch',},
        {name: 'productionTime',},
        {name: 'seed'},
        {name: 'sideKey'}
    ];

    prompt.start();

    prompt.get(prompt_attributes, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        } else {
            const productType = result.type;
            const ID = result.ID;
            const description = result.description;
            const productionLine = result.productionLine;
            const productionBatch = result.productionBatch;
            const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
            const productionTime = new Date(result.productionBatch.replace(pattern,'$3-$2-$1'));
            const sideKey = asciiToTrytes(result.sideKey);
            const seed = generateSeed(81);
            let product = new Product(null, null, productType, ID, description, productionLine, productionBatch, productionTime)

            if(companyName && messageRootID) {
                product.setSellerInformation(companyName, messageRootID);
            }

            console.log("seed "+seed);
            let channelState = createChannel(seed, security, mode, sideKey);

            const mamMessage = createMessage(channelState, asciiToTrytes(JSON.stringify(product)));

            console.log('Seed:', channelState.seed);
            console.log('Address:', mamMessage.address);
            console.log('Root:', mamMessage.root);
            console.log('NextRoot:', channelState.nextRoot);

            //product.messageRootID = mamMessage.root;
            //createProduct(product);

            const api = composeAPI({provider: globalProvider});

            console.log('Attaching to tangle, please wait...')
            await mamAttach(api, mamMessage, 3, 9, "MY9MAM");
            console.log(`You can view the mam channel here https://utils.iota.org/mam/${mamMessage.root}/${mode}/${sideKey}/devnet`);
        }
    });
}

module.exports = {
  create_product
};