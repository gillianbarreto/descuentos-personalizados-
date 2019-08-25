export interface cardBenefit {
    idBenefit: string,
    idGrupoBeneficio: string,
    id: string,
    nameBenefit: string,
    favorite: boolean,
    flagInterest: boolean,
    flagNotInterest: boolean,
    flagSeeLater?: boolean,
    urlImageBenefit: string,
    linkBenefit?: string,
    resumenBenefit?: string,
    descriptionBenefit?: string;
    nameEstablishment: string,
    urlProviderBenefitIcon: string
    rubroApp?: string,
    group?: string,
    subGroup?: string,
    termsAndConditions?: string,
    locals?: localsBenefit[],
    tags: string,
    providerBenefit?: string,
    urlImageCompany?: string,
    detail?: boolean,
    carousel?: boolean,
    destacados?: boolean
    favoriteList?: boolean,
    seeLaterList?: boolean,
    flagDestacado?: boolean
}

export interface sectionBenefit {
    idSection?: string,
    tittleSection: string,
    descriptionSection: string,
    benefit?: cardBenefit[];
}

export interface localsBenefit {
    establecimiento: string,
    direccion: string,
    longitud: string,
    latitud: string,
    distrito: string
}

export interface sources {
    fuenteDescuento: string,
    id: string,
    imgLogoFuente: string,
    tipoSuscripcion: string,
    checked?: boolean 
}