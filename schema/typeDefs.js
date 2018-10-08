const Agent = `
  type Agent {
    key: ID!
    name: String
    type: String
    image: String
    note: Note
    primaryLocation: Place
    primaryPhone: String
    email: String
  }
`

const Place = `
  type Place {
    names: [String]
    lat: String
    lng: String
    note: Note
  }
`

const Plan = `
  type Plan {
    plannedOn: String
    due: String
    note: String
    name: String
  }
`

const ProcessClassification = `
  type ProcessClassification {
    note: Note
    scope: Agent
    estimatedDuration: String
  }
`


const Process = `
  type Process {
    scope: Agent
    plannedStart: String
    plannedFinish: String
    isStarted: Boolean
    isFinished: Boolean
    processClassifiedAs: ProcessClassification
    note: Note
  }
`

const Commitment = `
  type Commitment {
    action: String
    process: Process
    inputOf: Process
    outputOf: Process
    provider: Agent
    receiver: Agent
    scope: Agent
    resourceClassifiedAs: ResourceClassification
    involves: EconomicResource
    committedQuantity: QuantityValue
    committedOn: String
    plannedStart: String
    due: String
    isFinished: Boolean
    plan: Plan
    isPlanDeliverable: Boolean
    forPlanDeliverable: Commitment
    note: Note
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

const ResourceClassification = `
  type ResourceClassification {
    image: String
    note: Note
    category: String
    processCategory: String
  }
`

const EconomicResource = `
  type EconomicResource {
    resourceClassifiedAs: ResourceClassification
    trackingIdentifier: String
    image: String
    currentQuantity: QuantityValue
    note: Note
    category: String
    currentLocation: Place
    createdDate: String
  }
`

const EconomicEvent = `
  type EconomicEvent {
    key: ID!
    action: String!
    inputOf: Process
    outputOf: Process
    provider: Agent
    receiver: Agent
    scope: Agent
    affects: [EconomicResource]
    affectedQuantity: QuantityValue
    start: String
    url: String
    requestDistribution: Boolean
    note: Note
    fulfills: Fulfillment
    
  }
`       

const Query = `
  type Query {
    agent(id: String): Agent
    economicEvent(id: String!): EconomicEvent
    economicEvents: [EconomicEvent]
  }
`

const Mutation = `
  input economicEventInput {
    action: String!
    inputOf: String
    outputOf: String
    provider: String
    receiver: String
    scope: String
    affects: String
    affectedQuantity: Int
    start: String
    url: String
    requestDistribution: Boolean
    note: String
    fulfills: String
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

module.exports = [
  Schema,
  Query,
  Mutation,
  EconomicEvent,
  Process,
  ProcessClassification,
  Agent,
  Place,
  Commitment,
  EconomicResource,
  ResourceClassification,
  QuantityValue,
  Unit,
  Fulfillment,
  Commitment,
  Plan,
  Note,
]