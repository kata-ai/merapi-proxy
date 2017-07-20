
declare module "merapi-proxy" {
    export function proxy<T>(uri: string, options?: {secret?:string, source?:string, timeout?:number, waitTime?:number}, logger?:any) : Promise<T>;
    export function proxySync<T>(uri: string, options?: {secret?:string, source?:string, timeout?:number, waitTime?:number}, logger?:any) : T;
}