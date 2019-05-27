export class ISjednaniResp {
    id: string;
    status: string;
    docs: any[];
    time: string;
}

export class ISrovnani {
    id: string;
    items: any[];
    time: string;
}

export class IItem {
    nazev: string;
    efektivniUrok: number;
    urok: number;
    splatka: number;
    urokZeSplatky: number;
    poplatekJednorazovy: number;
    poplatekMesicni: number;
    slevyZaProdukty: string;
    uroceni: string;
    hodnoceni: number;
    varovani: string;
    requestJson: {};
}
