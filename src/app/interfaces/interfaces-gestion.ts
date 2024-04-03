export interface gestionAtr{
    id:string,
    capital:number,
    risk:number,
    atr:number,
    side:string,
    tpRelacion:number,
    entryPrice:number,
    symbol:string,
    date:any,
    tick:number
}

export interface detallesGestion{
    id?:string,
    symbol:string,
    side:string,
    atr:number,
    entryPrice:number,
    stopLossPrice:number,
    distanciaPorcentajeSl:number,
    tpPorcentaje:number,
    tpPrecio:number,
    usdtRequerido:number,
    qty:number,
    sl:number,
    tp:number,
    maxOrderQty:any,
    minOrderQty:any,
    date:any,
    tick:any,
    tendenciaDirection:{trend:string,value:number}
}

export interface activatedSymbol{
    symbol:string,
    side:string,
    risk:number,
    tpRelation:number,
    AccountSize:number
}

export interface user{
    email:string,
    password:string,
    passwordRoot:string,
    role:string
}