export class IOdpovednost {
    id: any;
    pojisteni: any;
    pojistovna: any;
    produkt: any;
    sjed_cislo: any;
    sjed_status: any;
    sjed_datum: any;
    pocatek: any;
    konec: any;
    pojistne: any;
    provize: any;
    pc: any;
    vek: any;
    povolani: any;
    profese: any;
    spoluc: any;
    rizeni_voz: any;
    rizeni_sou: any;
    rizeni_nakl: any;
    rizeni_str: any;
    uz_platnost: any;
    limit_rv: any;
    limit_str: any;
    limit_zsv: any;
    pz: any;
    platba: any;
    pojistnik: IPojistnik;
    pojistenypojistnik: any;
    pojisteny: IOsoba;
    poznamka: any;
    promo_kod: any;
    ziskatel: any;
    idkod: any;
    ipadr: any;
}

export class IPojistnik {
    typ: any;
    titul: any;
    titul_za: any;
    jmeno: any;
    prijmeni: any;
    spolecnost: any;
    rc: any;
    ic: any;
    platce_dph: boolean;
    telefon: any;
    email: any;
    adresa: IAdresa;
    kadresa: any;
    kor_adresa: IAdresa;
}

export class IOsoba {
    typ: any;
    titul: any;
    titul_za: any;
    jmeno: any;
    prijmeni: any;
    spolecnost: any;
    rc: any;
    ic: any;
    adresa: IAdresa;
}

export class IAdresa {
    psc: any;
    cast_obce_id: any;
    obec: any;
    ulice: any;
    cp: any;
    adr_id: any;
}

export class ISrovnani {
    id: string;
    items: any[];
    time: string;
}
