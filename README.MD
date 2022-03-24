### RChain multisig

Multisig contract, used for managing funds, tokens, or executing arbitrary actions based on the agreement (or identical votes) between the members. RChain multisig is recursive, in the sense that a multisig contract can be a member of another multisig contract, thus forming a hierarchical, or web-like structure for some decentralized governance models.

![RChain multisig](https://i.ibb.co/hMrVSGN/title.jpg)

RChain multisig is very simple, members can propose operations, when at least 66% of the members propose the exact same operations in the same order, they are executed.

#### CLI

```
# Deploy an empty multisig
node cli deploy-multisig-mint
node cli mint-multisig

# Join the multisig
# 1st application is automatically accepted
node cli apply --application-id bob

# Propose the default implementation of the multisig
node cli propose-operations-channel

# Read the informations of the multisig
node cli read
```

#### Public methods

ro = Read only, it does not change the state of the contract in any way

```
ro PUBLIC_READ: () => All general informations about the contract
ro PUBLIC_READ_OPERATIONS: (memberId: String) => Nil | List[operation]
ro PUBLIC_READ_LAST_EXECUTED_OPERATIONS: () => Map([id]: String)
PUBLIC_APPLY: ({ applicationId: String, applicationChannel: channel }) => String | (true, String)
```

#### Private methods

Private methods are only available for members.

```
LEAVE: () => String | (true, Nil)
PROPOSE_OPERATIONS: (operations: Nil | List[operation]) => String | (true, Nil)
```
Leaving a multisig is of course not conditionned to members voting, anyone can leave at anytime.

#### Operations proposal / voting

Currently five operations are available in the defautl implementation, check `rholang/op_propose_operations_channel.rho` to understand further. 66% or more of the members must agree on the set of operations to execute, and on the same order, for the operations to effectively execute.

`ACCEPT`        : vote on accepting a pending application, and turn it into a membership
`KICKOUT`       : vote on kicking a member out of the multisig
`TRANSFER_REV`  : vote on tranfering REV from the vault of the multisig
`MINT_MULTISIG` : vote on minting a new multisig 2 through multisig 1, and instantly applying to it
`JOIN_MULTISIG` : vote on joining an existing multisig 2 through multisig 1

#### Testing

```
npm run test:acceptandtransfer
npm run test:kickout
npm run test:leave
npm run test:recursive
```
