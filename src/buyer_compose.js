const fs = require('fs');
const path = require('path');
const prompt = require('prompt');
const { asciiToTrytes } = require('@iota/converter');
const { composeAPI } = require('@iota/core');
const { create_product } = require('./manufacturer');
const { createChannel, channelRoot, createMessage, mamAttach } = require('@iota/mam.js');
const product = require('./product');
const Product = product.Product;
const { getProductMessage } = require('./buyer');
const {security, globalProvider, mode, generateSeed} = require("./utils");

function buy_compose() {
    var prompt_attributes = [
        {name: 'fileName'},
        {name: 'yourSeed'},
        {name: 'yourSideKey'}
    ];
    prompt.start();

    prompt.get(prompt_attributes, async function (err, result) {
        if (err) {
            console.log(err);
            return 1;
        } else {
            let root;
            let channelState;
            let buyerSeed = result.yourSeed;
            const buyerSideKey = asciiToTrytes(result.yourSideKey);
            const jsonPath = path.join(__dirname, result.fileName);
            const content = fs.readFileSync(jsonPath, 'utf8');
            const lines = content.split(new RegExp("\\s+"));
            console.log(lines);
            for (let line of lines) {
                const root = line.split(",")[0];
                const sideKey = line.split(",")[1];
                await getProductMessage(root, sideKey).then(async function (receivedProduct) {
                    try {
                        const currentState = fs.readFileSync('./channelState.json');
                        if (currentState) {
                            channelState = JSON.parse(currentState.toString());
                        }
                    } catch (e) {
                    }

                    if (!channelState) {
                        channelState = createChannel(generateSeed(81), security, mode, buyerSideKey) //TODO zamienic generateSeed na buyerseed
                        root = channelRoot(channelState)
                    }
                    const mamMessage = createMessage(channelState, asciiToTrytes(JSON.stringify(receivedProduct)));

                    console.log('Seed:', channelState.seed);
                    console.log('Address:', mamMessage.address);
                    console.log('Root:', mamMessage.root);
                    console.log('NextRoot:', channelState.nextRoot);

                    try {
                        fs.writeFileSync('./channelState.json', JSON.stringify(channelState, undefined, "\t"));
                    } catch (e) {
                        console.error(e)
                    }

                    const api = composeAPI({provider: globalProvider});

                    console.log('Attaching to tangle, please wait...')
                    await mamAttach(api, mamMessage, 3, 9, "MY9MAM");
                    console.log(`You can view the mam channel here https://utils.iota.org/mam/${mamMessage.root}/${mode}/${buyerSideKey}/devnet`);
                })
            }
            fs.unlinkSync("./channelState.json")
            create_product(buyerSideKey, root);
        }
    });
}

module.exports = {
    buy_compose
}