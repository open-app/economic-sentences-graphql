
const Process = `
  type Process {

  }
`

const Commitment = `
  type Commitment {
    
  }
`

const Fulfillment = `
  type Fulfillment {
    commitment: Commitment
    event: EconomicEvent
  }
`

const Note = `
  type Note {
    body: String!
  }
`
const Unit = `
  type Unit {
    name: String
}
`
const QuantityValue = `
  type QuantityValue {
    numericValue: String!
    unit: Unit
  }
`

const EconomicEvent = `
  type EconomicEvent {
    key: ID!
  }
`

// action: String!
// inputOf: Process
// outputOf: Process
// provider: [userId]
// receiver: [userId]
// scope: [userId]
// affects: [EconomicResource]
// affectedQuantity: QuantityValue
// start: String
// url: String
// requestDistribution: Boolean
// note: Note
// fulfills: Fulfillment           

const Query = `
  type Query {
    economicEvent(id: String!): EconomicEvent
    economicEvents: [EconomicEvent]
  }
`

const Mutation = `
  input economicEventInput {
    key: ID!
  }
  type Mutation {
    publishEconomicEvent(input: economicEventInput): EconomicEvent
  }
`
const Schema = () => [`
  schema {
    query: Query
    mutation: Mutation
  }
`]

module.exports = [Schema, Query, Mutation, EconomicEvent]