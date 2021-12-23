### RChain multisig

Multisig contract, used for executing actions based on the agreement between 66%+ (or another percentage) of the members. RChain multisig is recursive, in the sense that a multisig contract can be a member of another multisig contract, thus forming a hierarchical, or web-like structure for some decentralized governance models.

![RChain multisig](https://i.ibb.co/hMrVSGN/title.jpg)

RChain multisig is very simple, members can propose operations, when at least 66% of the members propose the exact same operations in the same order, they are executed.

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
ro PROPOSE_OPERATIONS: (operations: Nil | List[operation]) => String | (true, Nil)
```

Right now only two kind of operations can be proposed. `PROPOSE_OPERATIONS` will be rejected if one operation does not match one of the authorized operations.
```
# 1 REV transfer
{ "type": "TRANSFER_REV", "amount": Int, "recipient": String }
# 2 Accept application
{ "type": "ACCEPT", "applicationId": String }
```