const tape = require('tape')
const ssbKeys = require('ssb-keys')
const ssbClient = require('ssb-client')

const aliceKeys = ssbKeys.generate()
const bobKeys = ssbKeys.generate()
const carolKeys = ssbKeys.generate()

const createSsbServer = require('secret-stack')({})
  .use(require('ssb-db'))
  .use(require('..'))

const caps = {
  shs: require('crypto').randomBytes(32).toString('base64'),
}

const alice = createSsbServer({
  port: 45451,
  timeout: 2001,
  temp: 'master',
  host: 'localhost',
  master: bobKeys.id,
  keys: aliceKeys,
  caps: caps,
})

tape('connect remote master', (t) => {
  t.plan(2)
  if (process.env.TEST_VERBOSE) console.log(alice.config)
  alice.on('multiserver:listening', () => {
    ssbClient(
      bobKeys,
      {
        remote: alice.getAddress(),
        manifest: alice.manifest(),
        caps: caps,
      },
      (err, rpc) => {
        t.error(err)
        rpc.publish(
          {
            type: 'msg',
            value: 'written by bob',
            from: bobKeys.id,
          },
          (err) => {
            t.error(err)
            t.end()
          },
        )
      },
    )
  })
})

tape('non-master cannot use same methods', (t) => {
  t.plan(1)
  ssbClient(
    carolKeys,
    {
      remote: alice.getAddress(),
      manifest: alice.manifest(),
      caps: caps,
    },
    (err, rpc) => {
      if (err) throw err
      rpc.publish(
        {
          type: 'msg',
          value: 'written by ca',
          from: bobKeys.id,
        },
        (err) => {
          t.ok(err)
          alice.close(() => {
            t.end()
          })
        },
      )
    },
  )
})
