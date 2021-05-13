# ssb-master
`secret-stack` plugin that allows to use other public keys with master permissions in a [secret-stack](https://github.com/ssbc/secret-stack) instance. A common use case is the remote management of [Pubs](https://github.com/ssbc/ssb-server/wiki/pub-servers).


## Table of contents
[Example](#example) | [Instalation](#instalation) | [License](#license)

# Example
```js
var ssbKeys = require('ssb-keys')
var ssbClient = require('ssb-client')

var createApp = require('secret-stack')({})
    .use(require('ssb-db'))
    .use(require('ssb-master'))

// We have two pairs of keys,
// one belongs to Alice and the other to Bob
var aliceKeys = ssbKeys.generate()
var bobKeys   = ssbKeys.generate()

// Alice instance defines Bob's identity as master, 
// allowing Bob to perform actions in that instance.
var aliceApp = createApp({
  master: bobKeys.id,
  keys: aliceKeys
})


// Then Bob can connect remotely (using ssb-client) to Alice's instance and, for example, post a new message.
ssbClient(bobKeys, {
    remote: alice.getAddress(),
    manifest: alice.manifest()
}, function (err, rpc) {
    if(err) throw err
    rpc.publish({
        type: 'msg',
        value: 'written by bob',
        from: bobKeys.id
    }, function (err) {
        if(err) throw err
        console.log('Message published!')
    })
})
```

## Instalation
```js
var createApp = require('secret-stack')({})
    .use(require('ssb-master'))
    .use(...) //load others plugins
```

# License
MIT
