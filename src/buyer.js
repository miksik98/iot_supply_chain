const { trytesToAscii, asciiToTrytes } = require('@iota/converter')
const { composeAPI } = require('@iota/core');
const { createChannel, channelRoot, mamFetchAll, createMessage, mamAttach, parseMessage } = require('@iota/mam.js');
const product = require('./product');
const Product = product.Product;
const {security, globalProvider, mode, generateSeed} = require("./utils")
const {checkIfExistsMessageInProducer, createProduct, saveMessageInProducer, removeProduct } = require("./db/query")

async function getProductMessage(root, sideKey){
    const api = composeAPI({ provider: globalProvider });
    var message;
    console.log('Fetching from tangle, please wait...');
    const fetched = await mamFetchAll(api, root, mode, asciiToTrytes(sideKey));
    if (fetched && fetched.length > 0) {
        console.log('Fetched', trytesToAscii(fetched[0].message));
        message = trytesToAscii(fetched[0].message);
    } else {
        console.log('Nothing was fetched from the MAM channel');
    }
    message = JSON.parse(message);
    const p = new Product(message.companyName, message.messageRootID, message.productType, message.ID,
        message.description, message.productionLine, message.productionBatch, message.productionTime);
    console.log(root);
    p.setSellerInformation(sideKey, root);
    checkIfExistsMessageInProducer(p.messageRootID, p.companyName)
    console.log(p);
    return p
}

async function newChannelForProduct(receivedProduct, seed, sideKey){
    seed = generateSeed(81); //TODO delete this line
    sideKey = asciiToTrytes(sideKey)
    let channelState = createChannel(seed, security, mode, sideKey);
    const mamMessage = createMessage(channelState, asciiToTrytes(JSON.stringify(receivedProduct)));
    console.log('Seed:', channelState.seed);
    console.log('Address:', mamMessage.address);
    console.log('Root:', mamMessage.root);
    console.log('NextRoot:', channelState.nextRoot);

    product.messageRootID = mamMessage.root;

    const decodedMessage = parseMessage(mamMessage.payload, mamMessage.root, sideKey);

    console.log('Decoded NextRoot', decodedMessage.nextRoot);
    console.log('Decoded Message', decodedMessage.message);
    const api = composeAPI({provider: globalProvider});
    console.log('Attaching to tangle, please wait...')
    await mamAttach(api, mamMessage, 3, 9, "MY9MAM");
    console.log(`You can view the mam channel here https://utils.iota.org/mam/${mamMessage.root}/${mode}/${sideKey}/devnet`);
}

async function buyProduct(){
    var prompt = require('prompt');

    var prompt_attributes = [
        {name: 'root'},
        {name: 'sellerSideKey'},
        {name: 'yourSeed'},
        {name: 'yourSideKey'}
    ];
    prompt.start();

    prompt.get(prompt_attributes, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        } else {
            const root = result.root;
            const sellerSideKey = result.sellerSideKey;
            const buyerSeed = result.yourSeed;
            const buyerSideKey = result.yourSideKey;

            getProductMessage(root,
                sellerSideKey)
                .then(receivedProduct => {
                    newChannelForProduct(receivedProduct, buyerSeed, buyerSideKey);
                })
        }
    });
}

module.exports = {
    getProductMessage,
    buyProduct
};

