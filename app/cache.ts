import memoryCache from "memory-cache";

function setCache(name:string,key:string,value:string,time?:number){
    let ck = `${name}#${key}`
    let cv = `${value}#${new Date().getTime()}`

    memoryCache.put(ck,cv,time)
}


function getCache(name:string,key:string):string|null{
    let ck = `${name}#${key}`
    let cv : string = memoryCache.get(ck)
    if(cv){
        let cvl = cv.split("#")
        return cvl[0]
    }else {
        return null
    }
}

function getAddedTime(name:string,key:string):number{
    let ck = `${name}#${key}`
    let cv : string = memoryCache.get(ck)
    if(cv !== null){
        let cvl = cv.split("#")
        return ~~((new Date().getTime() - parseInt(cvl[1]))/1000)
    }else {
        return Infinity
    }
}

export {setCache,getCache,getAddedTime}