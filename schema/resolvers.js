const { 
  // getId,
  getAbout,
  // getBlob,
  publishMessage,
  getMessagesByType,
  get,
} = require('ssb-helpers')

const Query = {
  agent: async (_, { id }, { sbot }) => {
    let res
    try {
      const about = await getAbout({ id }, sbot)
      res = Object.assign({ key: about.value.content.about }, about.value.content)
    }
    catch (err) {
      res = null
    }
    return res
  },
  economicEvent: async (id, { sbot }) => {
    get(id)
      .then(msg => {
        console.log(msg)
        return msg
      })
  },
  economicEvents: async (_, {}, { sbot }) => {
    const msgs = await getMessagesByType({ type: 'economicEventTest' }, sbot)
    const formatedEvents = msgs.map(async (msg) => {
      let provider
      if (msg.value.content.provider) {
        const about = await getAbout({ id: msg.value.content.provider }, sbot)
        console.log('about: ', about)
        if(about) {
          provider = about.profile
          provider.key = about.id
        }
      }
      const res = Object.assign({ key: msg.key }, msg.value.content, { provider } )
      return res
    })
    return formatedEvents
  }
}

const Mutation = {
  publishEconomicEvent: (_, { input }, { sbot }) => {
    return publishMessage(Object.assign({ type: 'economicEventTest' }, input), sbot)
      .then(msg => Object.assign({ key: msg.key }, msg.value.content ))
  }
}

module.exports = {Query, Mutation}
