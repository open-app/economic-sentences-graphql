const { 
  // getId,
  // getAbout,
  // getBlob,
  publishMessage,
  getMessagesByType,
  get,
} = require('ssb-helpers')

const Query = {
  economicEvent: (id, { sbot }) => {
    get(id)
      .then(msg => {
        console.log(msg)
        return msg
      })
  },
  economicEvents: (_, {}, { sbot }) => getMessagesByType({ type: 'economicEvent' }, sbot)
}

const Mutation = {
  publishEconomicEvent: (_, { input }, { sbot }) => {
    const { key } = input
    const content = {
      type: 'economicEvent',
      key
    }
    return publishMessage(content, sbot)
  }
}

module.exports = {Query, Mutation}
