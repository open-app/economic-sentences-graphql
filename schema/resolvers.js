const { 
  // getId,
  getAbout,
  // getBlob,
  publish,
  message,
  getMessagesByType,
  get,
} = require('ssb-helpers')

const resourceClassficationType = 'resourceClassificationTest2'
const economicResourceType = 'economicResourceTest2'
const economicEventType = 'economicEventTest2'

const getResourceClassfication = async (id, sbot) => {
  const resourceClassification = await message({ id }, sbot)
  return Object.assign({ key: resourceClassification.key }, resourceClassification.value.content)
}

const getPrices = (prices) => prices.map(price => {
  const i = price.split(',')
  return {
    value: i[0],
    currency: i[1]
  }
})

const getEconomicResource = async (id, sbot) => {
  const economicResource = await message({ id }, sbot)
  const resourceClassifiedAs = await getResourceClassfication(economicResource.value.content.resourceClassifiedAs, sbot)
  const prices = getPrices(economicResource.value.content.prices)
  return Object.assign(
    economicResource.value.content,
    {key: id, resourceClassifiedAs, prices},
  )
}

const Query = {
  agent: async (_, { id }, { sbot }) => {
    try {
      return await getAbout({ id }, sbot)
    }
    catch (err) {
      console.log('ERROR', err)
    }
  },
  resourceClassifications: async (_, {}, { sbot }) => {
    try {
      const msgs = await getMessagesByType({ type: resourceClassficationType }, sbot)
      const formated = msgs.map(msg => Object.assign(
        {key: msg.key},
        msg.value.content
      ))
      return formated
    }
    catch (err) {
      console.log('ERROR', err)
    }
  },
  economicResources: async (_, {}, { sbot }) => {
    const msgs = await getMessagesByType({ type: economicResourceType }, sbot)
    const formated = msgs.map(async msg => {
      const resourceClassifiedAs = await getResourceClassfication(msg.value.content.resourceClassifiedAs, sbot)
      const prices = getPrices(msg.value.content.prices)
      return Object.assign(
        msg.value.content,
        {key: msg.key, resourceClassifiedAs, prices},
      )
    })
    return formated
  },
  publishedResources: async (_, {}, { sbot }) => {
    const msgs = await getMessagesByType({ type: economicResourceType }, sbot)
    const unpublished = msgs
      .filter(msg => typeof(msg.value.content.link) === 'string')
      .map(msg => msg.value.content.link)
    const filtered = msgs
      .filter(msg => msg.value.content.prices.length > 0)
      .filter(msg => {
        let isUnpublished
        unpublished.map(un => {
          if (msg.key === un) isUnpublished = true
        })
        if (isUnpublished) return false
        return true
      })
    console.log('filtered', filtered)
    return filtered.map(async msg => {
      const resourceClassifiedAs = await getResourceClassfication(msg.value.content.resourceClassifiedAs, sbot)
      const prices = getPrices(msg.value.content.prices)
      return Object.assign(
        msg.value.content,
        {key: msg.key, resourceClassifiedAs, prices},
      )
    })
  },
  economicEvent: async (id, { sbot }) => {
    get(id)
      .then(msg => {
        console.log(msg)
        return msg
      })
  },
  economicEvents: async (_, {}, { sbot }) => {
    const msgs = await getMessagesByType({ type: economicEventType }, sbot)
    return  msgs.map(async (msg) => {
      console.log('MSG', msg)
      let provider
      let affects
      if (msg.value.content.provider) {
        const about = await getAbout({ id: msg.value.content.provider }, sbot)
        console.log('about: ', about)
        if(about) {
          provider = about.profile
          provider.key = about.id
        }
      }
      if (msg.value.content.affects) {
        const affects = msg.value.content.affects.map(async affected => await getEconomicResource(affected, sbot))
      }
      const res = Object.assign(msg.value.content, { key: msg.key, provider } )
      console.log('RES', res)
      return res
    })
  }
}

const Mutation = {
  publishResourceClassification: (_, { input }, { sbot }) => {
    return publish(Object.assign({ type: resourceClassficationType }, input), sbot)
      .then(msg => Object.assign({ key: msg.key }, msg.value.content ))
  },
  publishEconomicResource: async (_, { input }, { sbot }) => {
    const resourceClassifiedAs = await getResourceClassfication(input.resourceClassifiedAs, sbot)
    const prices = getPrices(input.prices)
    return publish(Object.assign({ type: economicResourceType,  createdDate: new Date() }, input), sbot)
      .then(msg => Object.assign(
        msg.value.content,
        { key: msg.key, resourceClassifiedAs, prices },
      ))
  },
  unpublishEconomicResource: async (_, { id }, { sbot }) => {
    return publish({ type: economicResourceType, prices: [], link: id }, sbot)
      .then(msg => Object.assign(
        msg.value.content,
        { key: msg.key },
      ))
  },
  publishEconomicEvent: async (_, { input }, { sbot }) => {
    const affects = input.affects.map(async affected => await getEconomicResource(affected, sbot))
    return publish(Object.assign({ type: economicEventType }, input), sbot)
      .then(msg => Object.assign(
        msg.value.content,
        {
          key: msg.key,
          affects
        },
      ))
  }
}

module.exports = {Query, Mutation}
