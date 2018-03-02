# merapi-proxy
Plugin for component type proxy in merapi
## How to use it
in service.yml (or another configuration file like config.json) : 
```
proxyComponent:
  type: proxy
  uri: http://someUri
  version: v1
 ```
 (optional) if you want your service is not tightly coupled with component type proxy, you can enable `lazy` : 
 ```
 proxyComponent:
    type: proxy
    lazy: true
    retryDelay: 1000 // optional, default 3000 ms
    uri: http://someUri
    version: v1
 ```
  
