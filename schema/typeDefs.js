const Agent = `
  type Agent {
    key: ID
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
    provider: ID
    receiver: ID
    scope: ID
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

module.exports = [
  Schema,
  Query,
  Mutation,
  EconomicEvent,
  Process,
  ProcessClassification,
  Agent,
  Place,
  Commit,
  EconomicResource,
  ResourceClassification,
  QuantityValue,
  Unit,
  Fulfillment,
  Commitment,
  Plan,
]