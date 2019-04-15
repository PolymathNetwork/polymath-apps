import { MetamaskDownloader } from ".";
import { Browser, MetamaskData } from "../shared";


class BraveMetamask extends MetamaskDownloader {
    public async getExtension(): Promise<MetamaskData> {
        console.log('Metamask is installed by default in Brave');
        return { uncompressed: null, file: null, afterExecution: null, extensionId: null };
    }
}

MetamaskDownloader.Register(BraveMetamask, Browser.Brave);