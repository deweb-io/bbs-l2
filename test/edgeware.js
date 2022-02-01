
let box;

describe('L2 - Edgware testing', () => {
    it('test BOX', async() => {
        const Box = await hre.ethers.getContractFactory('Box');

        //box = await Box.attach('0x295990924dFbAC87024121aBAeF413e9f56aDb47');
        //console.log("Attach box: 0x295990924dFbAC87024121aBAeF413e9f56aDb47");

        box = await Box.deploy();
        await box.deployed();
        console.log('box deployed:', box.address);
    });

    it('TEST EDGEWARE - BOX test', async() => {
        const num = Math.floor(Math.random() * 10);
        await box.store(num);
        //let retrieveVal = new BigNumber();
        await new Promise(resolve => setTimeout(resolve, 6000));
        console.log('TEST EDGEWARE Box store: ', num);
        console.log('TEST EDGEWARE Box retrieve: ', (await box.retrieve()).toNumber());
    });
});
