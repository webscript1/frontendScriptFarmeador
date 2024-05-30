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
    _id?:string,
    id?:string
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
    tendenciaDirection:{trend:string,value:number},
    process?:string,
    status?:string,
    candles?:Array<any>
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

export interface Account_info{
    _id?:any
    capital:number,
    risk: number,
    tprelation: number,
    positions:Array<{id:any,status:String,sl:Number,tp:Number,}>,
    mg: number,
    loss: number,
    win: number,
    winPorcentaje: number,
    drawdown: number,
    currentcapital: number,
    maximoCapital: number,
    totalOperations:number,
    profit:number,
    profitPorcentaje:number,
}
export interface instanciasAuto{
    _id?:string
    name:string,
    account:{risk:number,capital:number,tp_relation:number,fee:number},
    service:string,
    intervalRsi:string,
    positionNumer:number,
    status:boolean,
    filter:{volumen:number,rsiUp:number,rsiDown:number,rsiBtcUp:number,rsiBtcDown:number,
           priceSymbol:number}
}

export interface rsiDb{
    _id?:string,
    symbol: string,
      rsi:number,
      precioClose:number
      bbUpper:number,
      bbLow:number,
      comercio:string,
      tipo: string,
      time:string,
      precioFueraBB:number,
      date: string,
      volumen:number,
      rsiBtc:number,
      status:string,
      idPosition:string,
      idInstancia:string,
      createdAt?:any
}

export interface pagination{
    limit:number,
    totalDocs:number,
    totalPages:number,
    page:number,
    nextPage:number,
    prevPage:number
}