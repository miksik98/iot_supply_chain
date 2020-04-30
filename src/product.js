class Product {
    companyName;
    messageRootID;
    productType;
    ID;
    description;
    productionLine;
    productionBatch;
    productionTime;

    constructor(companyName, messageRootID, productType, ID, description, productionLine, productionBatch, productionTime) {
        this.companyName = companyName;
        this.messageRootID = messageRootID;
        this.productType = productType;
        this.ID = ID;
        this.description = description;
        this.productionLine = productionLine;
        this.productionBatch = productionBatch;
        this.productionTime = productionTime;
    }

    verify(){
        // TODO
    }

    setSellerInformation(sellerName, sellerRootID){
        this.companyName = sellerName;
        this.messageRootID = sellerRootID;
    }
}