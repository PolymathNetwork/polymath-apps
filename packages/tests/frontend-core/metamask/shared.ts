import { FileResult, DirResult } from "tmp";

export interface MetamaskOptions {
    extensionId: string;
}

export interface MetamaskData extends MetamaskOptions {
    uncompressed: DirResult;
    file: FileResult;
    afterExecution: () => void;
}

export enum Network {
    "Main",
    "Ropsten",
    "Rinkeby",
    "Kovan",
    "Localhost",
    "Custom"
}

export enum Browser {
    Chrome, Firefox, Brave, Opera, Safari, Edge
}


export function GetFileExtensionForBrowser(browser: Browser) {
    switch (browser) {
        case Browser.Brave:
        case Browser.Opera:
        case Browser.Chrome:
            return 'crx';
        case Browser.Firefox:
            return 'xpi';
        case Browser.Safari:
            return 'xyz';
        case Browser.Edge:
            return 'appx';
    }
}