# Stamp-Cache

The STAMP Cache is a cache server that allows for SPA apps to quickly read the state of contracts without having to re-evaluate the whole history of the contract. This saves time and effort when working with contracts that perform internalWrites or readStates of other contracts.

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

Overtime the state object can grow large and it could be a challenge to pull the whole state object to the client and then filter, sort and transform the data from the state that you need. By posting a FP-JSON 

#### What is FP-JSON?

FP-JSON is a functional programming language in JSON, the language allows you to create code that can be sent across the wire to another process and executed in that process, this allows for a generalized service to perform the computation remotely before delivering the response. 

#### How can I use this feature?

> For more examples about FP-JSON check out https://fpjson.asteroid.ac/ 

Lets say, I wanted to return the just the value of the stamp property for the stamp contract. The FP-JSON I would send would look like this:

```json
["prop", "stamps"]
```

This function will execute on the state object by calling the prop(attr) it will return another function requesting the state object, then the result will be the value in the stamps property of the state object. The imperative code may look like this:

```js
function prop(attr) {
  return function (state) {
    return state[attr]
  }
}
```

With this feature we can declare filters, sorts, transforms using JSON and instruct the cache server to perform the processing, versus having to pull the whole state down the wire and then perform the processing locally. 

Another example is getting the balance of a specific wallet address, instead of pulling the whole state down and the grabing the balances property and the wallet address from the balance proopery, we can use the path function.

> NOTE: adding the "[]" as the first argument lets the path function know that the argument is an array of values.

```json
["path", ["[]", "balances", "7bvXNPRamyiQ9tiq84XnUcOvrNxYIcekMU2Y2cLMkM8"]]
```

If you are familiar with libraries like "ramdajs" or "lodash", the FP-JSON language is modeled after these libraries which include a great set of features for managing object data sets.

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
- [ ] Decentalize the service, so any one can run a server


