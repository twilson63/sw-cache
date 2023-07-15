# SmartWeave-Cache

The SW Cache is a cache server that allows SPA apps to quickly read the state of contracts without re-evaluating the entire history of the contract. This saves time and effort when working with contracts that perform internal writes or read states of other contracts.

## API

### Get Current Contract STATE:

```
GET /:contract
#> { balances: {}, name: '', ticker: ''}
```

#### Example

```js
const state = await fetch(`${CACHE}/${CONTRACT}`).then(res => res.json())
console.log(state)
```

### Sync STATE:

```
GET /contract?id=[CONTRACT]
#> { sortKey, state, validity}
```

This function enables you to sync state in the browser!

#### Example

```js
console.time('bar-state')
const contract = await _warp.contract('VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA')
  .syncState(barUrl, { validity: true })

const { sortKey } = await _warp.stateEvaluator.latestAvailableState('VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA');

console.log(sortKey);

const result = await _warp.contract('VFr3Bk-uM-motpNNkkFg4lNW1BMmSfzqsVO551Ho4hA').setEvaluationOptions({
  internalWrites: true,
  allowBigInt: true,
  unsafeClient: 'allow'
}).readState()


console.timeEnd('bar-state')
```

### POST FP-JSON to return partial state

Over time, the state object can grow large, and it could be challenging to pull the entire state object to the client and then filter, sort, and transform the data from the state that you need. By posting an FP-JSON, you can perform these operations on the server side.

#### What is FP-JSON?

FP-JSON is a functional programming language in JSON. It allows you to create code that can be sent across the wire to another process and executed in that process. This enables a generalized service to perform the computation remotely before delivering the response.

#### How can I use this feature?

> For more examples of FP-JSON, check out [https://fpjson.asteroid.ac/](https://fpjson.asteroid.ac/)

For example, if you want to return only the value of the `stamp` property for the stamp contract, the FP-JSON you would send is:

```json
["prop", "stamps"]
```

This function will execute on the state object by calling `prop(attr)`, which returns another function that requests the state object. The result will be the value in the `stamps` property of the state object. The imperative code equivalent of this function is:

```js
function prop(attr) {
  return function (state) {
    return state[attr]
  }
}
```

With this feature, you can declare filters, sorts, and transformations using JSON and instruct the cache server to perform the processing, rather than pulling the entire state down the wire and performing the processing locally.

Another example is getting the balance of a specific wallet address. Instead of pulling the whole state and grabbing the `balances` property and the wallet address from the `balances` property, you can use the `path` function.

> NOTE: Adding `[]` as the first argument lets the `path` function know that the argument is an array of values.

```json
["path", ["[]", "balances", "7bvXNPRamyiQ9tiq84XnUcOvrNxYIcekMU2Y2cLMkM8"]]
```

If you are familiar with libraries like "ramdajs" or "lodash", the FP-JSON language is modeled after these libraries and includes a great set of features for managing object datasets.

#### Example

```js
const result = await fetch(`${CACHE}/${CONTRACT}`, {
  method: 'POST',
  body: JSON.stringify(["path", ["[]", "balances", "7bvXNPRamyiQ9tiq84XnUcOvrNxYIcekMU2Y2cLMkM8"]]),
  headers: { 'content-type': 'application/json' }
})
console.log('Balance: ', result)
```

## Roadmap

TODO:

- [x] Add FP-JSON to support filtering state via a POST /:contract
- [ ] P3 to accept payments to use the service
- [ ] Decentralize the service so anyone can run a server
