# PolymathRegistry

Registry that holds addresses for other smart contracts

## Methods

```ts
/* == Read-Only methods == */
// Gets the address of a contract in the registry
function getAddress(_nameKey: String) => Address
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function owner() => Address
function storedAddresses(: Bytes32) => Address

/* == Can mutate state == */
function changeAddress(_nameKey: String, _newAddress: Address) => void
function reclaimERC20(_tokenContract: Address) => void
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event ChangeAddress(_nameKey: String, _oldAddress: Address, _newAddress: Address)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
```

# ModuleRegistry

Registry contract to store registered modules

## Methods

```ts
/* == Read-Only methods == */
// Returns the list of available Module factory addresses of a particular type for a given token
function getModulesByTypeAndToken(_moduleType: UInt8, _securityToken: Address) => Address[]
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function getAddressValues(_variable: Bytes32) => Address
function getBoolValues(_variable: Bytes32) => Boolean
function getBytes32Values(_variable: Bytes32) => Bytes32
function getBytesValues(_variable: Bytes32) => Bytes
function getModulesByType(_moduleType: UInt8) => Address[]
function getReputationByFactory(_factoryAddress: Address) => Address[]
function getStringValues(_variable: Bytes32) => String
function getTagsByType(_moduleType: UInt8) => (Bytes32[], Address[])
function getTagsByTypeAndToken(_moduleType: UInt8, _securityToken: Address) => (Bytes32[], Address[])
function getUintValues(_variable: Bytes32) => UInt256
function isPaused() => Boolean
function owner() => Address

/* == Can mutate state == */
function pause() => void
function reclaimERC20(_tokenContract: Address) => void
function registerModule(_moduleFactory: Address) => void
function removeModule(_moduleFactory: Address) => void
function unpause() => void
function updateFromRegistry() => void
function useModule(_moduleFactory: Address) => void
function verifyModule(_moduleFactory: Address, _verified: Boolean) => void
```

</details>

## Events

```ts
event ModuleRegistered(_moduleFactory: Address, _owner: Address)
event ModuleRemoved(_moduleFactory: Address, _decisionMaker: Address)
event ModuleUsed(_moduleFactory: Address, _securityToken: Address)
event ModuleVerified(_moduleFactory: Address, _verified: Boolean)
event Pause(_timestammp: UInt256)
event Unpause(_timestamp: UInt256)
```

# PolyToken

The POLY token's smart contract. Implements the ERC20 interface

## Methods

```ts
/* == Read-Only methods == */
// Amount of allowance approved by an `owner` to a `spender`
function allowance(_owner: Address, _spender: Address) => UInt256
// Gets the total amount of tokens for an address
function balanceOf(_owner: Address) => balance: UInt256
// Name of the token
function name() => String
// Token's symbol (POLY)
function symbol() => String
// Total amount of tokens that exist in the network
function totalSupply() => UInt256

/* == Can mutate state == */
// Sets allowance for a `spender`
function approve(_spender: Address, _value: UInt256) => Boolean
// Transfers tokens to an address
function transfer(_to: Address, _value: UInt256) => Boolean
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function decimalFactor() => UInt256
function decimals() => UInt8

/* == Can mutate state == */
function decreaseApproval(_spender: Address, _subtractedValue: UInt256) => Boolean
function increaseApproval(_spender: Address, _addedValue: UInt256) => Boolean
function transferFrom(_from: Address, _to: Address, _value: UInt256) => Boolean
```

</details>

## Events

```ts
event Approval(owner: Address, spender: Address, value: UInt256)
event Transfer(from: Address, to: Address, value: UInt256)
```

# CappedSTOFactory

Factory for [CappedSTO](#CappedSTO) STO module.
Capped STOs set a limit on the total amount of funding an STO can raise.

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to setup a token with this module
function setupCost() => UInt256
function getName() => Bytes32
function getSetupCost() => UInt256
function getVersion() => String
function owner() => Address
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function description() => String
function getDescription() => String
function getInstructions() => String
function getLowerSTVersionBounds() => UInt8[]
function getTags() => Bytes32[]
function getTitle() => String
function getTypes() => UInt8[]
function getUpperSTVersionBounds() => UInt8[]
function monthlySubscriptionCost() => UInt256
function name() => Bytes32
function polyToken() => Address
function title() => String
function usageCost() => UInt256
function version() => String

/* == Can mutate state == */
function changeDescription(_newDesc: String) => void
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function changeName(_newName: Bytes32) => void
function changeSTVersionBounds(_boundType: String, _newVersion: UInt8[]) => void
function changeTitle(_newTitle: String) => void
function changeVersion(_newVersion: String) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event ChangeFactorySetupFee(_oldSetupCost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event ChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event ChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event ChangeSTVersionBound(_boundType: String, _major: UInt8, _minor: UInt8, _patch: UInt8)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _setupCost: UInt256, _timestamp: UInt256)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
```

# USDTieredSTOFactory

Factory for [USDTieredSTO](#USDTieredSTO) STO module.
USDTieredSTO allows issuers to set multiple USD price tiers for their
STO.

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to setup a token with this module
function setupCost() => UInt256
function getName() => Bytes32
function getSetupCost() => UInt256
function getVersion() => String
function owner() => Address
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function USDTieredSTOProxyAddress() => Address
function description() => String
function getDescription() => String
function getInstructions() => String
function getLowerSTVersionBounds() => UInt8[]
function getTags() => Bytes32[]
function getTitle() => String
function getTypes() => UInt8[]
function getUpperSTVersionBounds() => UInt8[]
function monthlySubscriptionCost() => UInt256
function name() => Bytes32
function polyToken() => Address
function title() => String
function usageCost() => UInt256
function version() => String

/* == Can mutate state == */
function changeDescription(_newDesc: String) => void
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function changeName(_newName: Bytes32) => void
function changeSTVersionBounds(_boundType: String, _newVersion: UInt8[]) => void
function changeTitle(_newTitle: String) => void
function changeVersion(_newVersion: String) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event ChangeFactorySetupFee(_oldSetupCost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event ChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event ChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event ChangeSTVersionBound(_boundType: String, _major: UInt8, _minor: UInt8, _patch: UInt8)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _setupCost: UInt256, _timestamp: UInt256)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
```

# CountTransferManagerFactory

Factory for [CountTransferManager](#CountTransferManager)

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to setup a token with this module
function setupCost() => UInt256
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function description() => String
function getDescription() => String
function getInstructions() => String
function getLowerSTVersionBounds() => UInt8[]
function getName() => Bytes32
function getSetupCost() => UInt256
function getTags() => Bytes32[]
function getTitle() => String
function getTypes() => UInt8[]
function getUpperSTVersionBounds() => UInt8[]
function getVersion() => String
function monthlySubscriptionCost() => UInt256
function name() => Bytes32
function owner() => Address
function polyToken() => Address
function title() => String
function usageCost() => UInt256
function version() => String

/* == Can mutate state == */
function changeDescription(_newDesc: String) => void
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function changeName(_newName: Bytes32) => void
function changeSTVersionBounds(_boundType: String, _newVersion: UInt8[]) => void
function changeTitle(_newTitle: String) => void
function changeVersion(_newVersion: String) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event ChangeFactorySetupFee(_oldSetupCost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event ChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event ChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event ChangeSTVersionBound(_boundType: String, _major: UInt8, _minor: UInt8, _patch: UInt8)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _setupCost: UInt256, _timestamp: UInt256)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
```

# CountTransferManager

Limits the amount of tokens a given address
can hold. It will prevent any transfer that violates the max amount
of tokens an address can hold.

## Methods

```ts
/* == Read-Only methods == */
// Maximum amount of tokens one person can hold
function maxHolderCount() => UInt256
// Wether the module is paused or not
function paused() => Boolean

/* == Can mutate state == */
// Pauses the module
function pause() => void
// Sets the maximum amount of tokens one person can hold
function changeHolderCount(_maxHolderCount: UInt256) => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function ADMIN() => Bytes32
function FEE_ADMIN() => Bytes32
function factory() => Address
function getPermissions() => Bytes32[]
function polyToken() => Address
function securityToken() => Address

/* == Can mutate state == */
function configure(_maxHolderCount: UInt256) => void
function takeFee(_amount: UInt256) => Boolean
function unpause() => void
function verifyTransfer(: Address, _to: Address, : UInt256, : Bytes, : Boolean) => UInt8
```

</details>

## Events

```ts
event ModifyHolderCount(_oldHolderCount: UInt256, _newHolderCount: UInt256)
event Pause(_timestammp: UInt256)
event Unpause(_timestamp: UInt256)
```

# PercentageTransferManager

Similar to [CountTransferManager](#CountTransferManager) except the
limits are set in percentages.

It also has a whitelist of addresses that
can bypass the module's transfer validations

## Methods

```ts
/* == Read-Only methods == */
// Gets the max percentage of tokens any address can hold
function maxHolderPercentage() => UInt256
// Wether the module is paused or not
function paused() => Boolean

/* == Can mutate state == */
// Adds or removes an address from the whitelist
function modifyWhitelist(_investor: Address, _valid: Boolean) => void
// Adds or removes the addresses in the whitelist
function modifyWhitelistMulti(_investors: Address[], _valids: Boolean[]) => void
// Pauses the module
function pause() => void
// Sets the maximum percent of the total tokens that one person can hold
function changeHolderPercentage(_maxHolderPercentage: UInt256) => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function ADMIN() => Bytes32
function FEE_ADMIN() => Bytes32
function WHITELIST() => Bytes32
function allowPrimaryIssuance() => Boolean
function factory() => Address
function getPermissions() => Bytes32[]
function polyToken() => Address
function securityToken() => Address
function whitelist(: Address) => Boolean

/* == Can mutate state == */
function configure(_maxHolderPercentage: UInt256, _allowPrimaryIssuance: Boolean) => void
function setAllowPrimaryIssuance(_allowPrimaryIssuance: Boolean) => void
function takeFee(_amount: UInt256) => Boolean
function unpause() => void
function verifyTransfer(_from: Address, _to: Address, _amount: UInt256, : Bytes, : Boolean) => UInt8
```

</details>

## Events

```ts
event ModifyHolderPercentage(_oldHolderPercentage: UInt256, _newHolderPercentage: UInt256)
event ModifyWhitelist(_investor: Address, _dateAdded: UInt256, _addedBy: Address, _valid: Boolean)
event Pause(_timestammp: UInt256)
event SetAllowPrimaryIssuance(_allowPrimaryIssuance: Boolean, _timestamp: UInt256)
event Unpause(_timestamp: UInt256)
```

# PercentageTransferManagerFactory

Factory for [PercentageTransferManager](#PercentageTransferManager)

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to setup a token with this module
function setupCost() => UInt256
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function description() => String
function getDescription() => String
function getInstructions() => String
function getLowerSTVersionBounds() => UInt8[]
function getName() => Bytes32
function getSetupCost() => UInt256
function getTags() => Bytes32[]
function getTitle() => String
function getTypes() => UInt8[]
function getUpperSTVersionBounds() => UInt8[]
function getVersion() => String
function monthlySubscriptionCost() => UInt256
function name() => Bytes32
function owner() => Address
function polyToken() => Address
function title() => String
function usageCost() => UInt256
function version() => String

/* == Can mutate state == */
function changeDescription(_newDesc: String) => void
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function changeName(_newName: Bytes32) => void
function changeSTVersionBounds(_boundType: String, _newVersion: UInt8[]) => void
function changeTitle(_newTitle: String) => void
function changeVersion(_newVersion: String) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event ChangeFactorySetupFee(_oldSetupCost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event ChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event ChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event ChangeSTVersionBound(_boundType: String, _major: UInt8, _minor: UInt8, _patch: UInt8)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _setupCost: UInt256, _timestamp: UInt256)
event GenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
```

# SecurityToken

The security token smart contract. It defines the behavior of the
Security Tokens created through Polymath.

Only the token's owner and the attached STO module (if there is one) can
mint tokens.

## Methods

```ts
/* == Read-Only methods == */
// Amount of allowance approved by an `owner` to a `spender`
function allowance(_owner: Address, _spender: Address) => UInt256
// Gets the total amount of tokens for an address
function balanceOf(_owner: Address) => UInt256
// Name of the token
function name() => String
// Token's symbol (this is what was registered in the SecurityTokenRegistry)
function symbol() => String
// Total amount of tokens that exist in the network
function totalSupply() => UInt256

/* == Can mutate state == */
// Mints new tokens and assignes them to an `_investor` address
function mint(_investor: Address, _value: UInt256) => success: Boolean
// Mints new tokens and assigns them to `_investors`
function mintMulti(_investors: Address[], _values: UInt256[]) => success: Boolean
// Prevents further transactions
function freezeTransfers() => void
// Sets allowance for a `spender`
function approve(_spender: Address, _value: UInt256) => Boolean
// Transfers tokens to an address
function transfer(_to: Address, _value: UInt256) => success: Boolean
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function balanceOfAt(_investor: Address, _checkpointId: UInt256) => UInt256
function checkPermission(_delegate: Address, _module: Address, _perm: Bytes32) => Boolean
function controller() => Address
function controllerDisabled() => Boolean
function currentCheckpointId() => UInt256
function decimals() => UInt8
function featureRegistry() => Address
function getCheckpointTimes() => UInt256[]
function getInvestorCount() => UInt256
function getInvestors() => Address[]
function getModule(_module: Address) => (Bytes32, Address, Address, Boolean, UInt8[])
function getModulesByName(_name: Bytes32) => Address[]
function getModulesByType(_type: UInt8) => Address[]
function getVersion() => UInt8[]
function granularity() => UInt256
function mintingFrozen() => Boolean
function moduleRegistry() => Address
function owner() => Address
function polyToken() => Address
function polymathRegistry() => Address
function securityTokenRegistry() => Address
function tokenDetails() => String
function totalSupplyAt(_checkpointId: UInt256) => UInt256
function transfersFrozen() => Boolean

/* == Can mutate state == */
function addModule(_moduleFactory: Address, _data: Bytes, _maxCost: UInt256, _budget: UInt256) => void
function archiveModule(_module: Address) => void
function burnFromWithData(_from: Address, _value: UInt256, _data: Bytes) => void
function burnWithData(_value: UInt256, _data: Bytes) => void
function changeGranularity(_granularity: UInt256) => void
function changeModuleBudget(_module: Address, _budget: UInt256) => void
function createCheckpoint() => UInt256
function decreaseApproval(_spender: Address, _subtractedValue: UInt256) => Boolean
function disableController() => void
function forceBurn(_from: Address, _value: UInt256, _data: Bytes, _log: Bytes) => void
function forceTransfer(_from: Address, _to: Address, _value: UInt256, _data: Bytes, _log: Bytes) => void
function freezeMinting() => void
function increaseApproval(_spender: Address, _addedValue: UInt256) => Boolean
function mintWithData(_investor: Address, _value: UInt256, _data: Bytes) => success: Boolean
function pruneInvestors(_start: UInt256, _iters: UInt256) => void
function removeModule(_module: Address) => void
function renounceOwnership() => void
function setController(_controller: Address) => void
function transferFrom(_from: Address, _to: Address, _value: UInt256) => Boolean
function transferFromWithData(_from: Address, _to: Address, _value: UInt256, _data: Bytes) => Boolean
function transferOwnership(_newOwner: Address) => void
function transferWithData(_to: Address, _value: UInt256, _data: Bytes) => success: Boolean
function unarchiveModule(_module: Address) => void
function unfreezeTransfers() => void
function updateFromRegistry() => void
function updateTokenDetails(_newTokenDetails: String) => void
function verifyTransfer(_from: Address, _to: Address, _value: UInt256, _data: Bytes) => Boolean
function withdrawPoly(_value: UInt256) => void
```

</details>

## Events

```ts
event Approval(owner: Address, spender: Address, value: UInt256)
event Burnt(_from: Address, _value: UInt256)
event ChangeSTRAddress(_oldAddress: Address, _newAddress: Address)
event CheckpointCreated(_checkpointId: UInt256, _timestamp: UInt256)
event DisableController(_timestamp: UInt256)
event ForceBurn(_controller: Address, _from: Address, _value: UInt256, _verifyTransfer: Boolean, _data: Bytes)
event ForceTransfer(_controller: Address, _from: Address, _to: Address, _value: UInt256, _verifyTransfer: Boolean, _data: Bytes)
event FreezeMinting(_timestamp: UInt256)
event FreezeTransfers(_status: Boolean, _timestamp: UInt256)
event GranularityChanged(_oldGranularity: UInt256, _newGranularity: UInt256)
event Minted(_to: Address, _value: UInt256)
event ModuleAdded(_types: UInt8[], _name: Bytes32, _moduleFactory: Address, _module: Address, _moduleCost: UInt256, _budget: UInt256, _timestamp: UInt256)
event ModuleArchived(_types: UInt8[], _module: Address, _timestamp: UInt256)
event ModuleBudgetChanged(_moduleTypes: UInt8[], _module: Address, _oldBudget: UInt256, _budget: UInt256)
event ModuleRemoved(_types: UInt8[], _module: Address, _timestamp: UInt256)
event ModuleUnarchived(_types: UInt8[], _module: Address, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
event SetController(_oldController: Address, _newController: Address)
event Transfer(from: Address, to: Address, value: UInt256)
event UpdateTokenDetails(_oldDetails: String, _newDetails: String)
```

# SecurityTokenRegistry

Keeps track of all the Security Tokens that exist in the network.
Keeps record of the tickers reserved by users.

Through this contract Security Tokens can be created and Tickers can be registered.
It requires an allowance (of at least the registration fee) to be set to be able
to create a Security Token

## Methods

```ts
/* == Read-Only methods == */
// Gets the details of a ticker
function getTickerDetails(_ticker: String) => (Address, UInt256, UInt256, String, Boolean)

/* == Can mutate state == */
// Generates a security token
function generateSecurityToken(_name: String, _ticker: String, _tokenDetails: String, _divisible: Boolean) => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function getAddressValues(_variable: Bytes32) => Address
function getBoolValues(_variable: Bytes32) => Boolean
function getBytes32Values(_variable: Bytes32) => Bytes32
function getBytesValues(_variable: Bytes32) => Bytes
function getExpiryLimit() => UInt256
function getProtocolVersion() => UInt8[]
function getSTFactoryAddress() => Address
function getSecurityTokenAddress(_ticker: String) => Address
function getSecurityTokenData(_securityToken: Address) => (String, Address, String, UInt256)
function getSecurityTokenLaunchFee() => UInt256
function getStringValues(_variable: Bytes32) => String
function getTickerRegistrationFee() => UInt256
function getTickersByOwner(_owner: Address) => Bytes32[]
function getTokensByOwner(_owner: Address) => Address[]
function getUintValues(_variable: Bytes32) => UInt256
function isPaused() => Boolean
function isSecurityToken(_securityToken: Address) => Boolean
function owner() => Address

/* == Can mutate state == */
function changeExpiryLimit(_newExpiry: UInt256) => void
function changeSecurityLaunchFee(_stLaunchFee: UInt256) => void
function changeTickerRegistrationFee(_tickerRegFee: UInt256) => void
function modifySecurityToken(_name: String, _ticker: String, _owner: Address, _securityToken: Address, _tokenDetails: String, _deployedAt: UInt256) => void
function modifyTicker(_owner: Address, _ticker: String, _tokenName: String, _registrationDate: UInt256, _expiryDate: UInt256, _status: Boolean) => void
function pause() => void
function reclaimERC20(_tokenContract: Address) => void
function registerTicker(_owner: Address, _ticker: String, _tokenName: String) => void
function removeTicker(_ticker: String) => void
function setProtocolVersion(_STFactoryAddress: Address, _major: UInt8, _minor: UInt8, _patch: UInt8) => void
function transferOwnership(_newOwner: Address) => void
function transferTickerOwnership(_newOwner: Address, _ticker: String) => void
function unpause() => void
function updatePolyTokenAddress(_newAddress: Address) => void
```

</details>

## Events

```ts
event ChangeExpiryLimit(_oldExpiry: UInt256, _newExpiry: UInt256)
event ChangeSecurityLaunchFee(_oldFee: UInt256, _newFee: UInt256)
event ChangeTickerOwnership(_ticker: String, _oldOwner: Address, _newOwner: Address)
event ChangeTickerRegistrationFee(_oldFee: UInt256, _newFee: UInt256)
event NewSecurityToken(_ticker: String, _name: String, _securityTokenAddress: Address, _owner: Address, _addedAt: UInt256, _registrant: Address, _fromAdmin: Boolean, _registrationFee: UInt256)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
event Pause(_timestammp: UInt256)
event RegisterTicker(_owner: Address, _ticker: String, _name: String, _registrationDate: UInt256, _expiryDate: UInt256, _fromAdmin: Boolean, _registrationFee: UInt256)
event TickerRemoved(_ticker: String, _removedAt: UInt256, _removedBy: Address)
event Unpause(_timestamp: UInt256)
```

# GeneralTransferManager

_TODO: Add description_

## Methods

```ts
/* == Read-Only methods == */
// Wether the module is paused or not
function paused() => Boolean

/* == Can mutate state == */
// Adds or removes an address from the whitelist
function modifyWhitelist(_investor: Address, _fromTime: UInt256, _toTime: UInt256, _expiryTime: UInt256, _canBuyFromSTO: Boolean) => void
// Adds or removes the addresses in the whitelist
function modifyWhitelistMulti(_investors: Address[], _fromTimes: UInt256[], _toTimes: UInt256[], _expiryTimes: UInt256[], _canBuyFromSTO: Boolean[]) => void
// Pauses the moduel
function pause() => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function FEE_ADMIN() => Bytes32
function FLAGS() => Bytes32
function WHITELIST() => Bytes32
function allowAllBurnTransfers() => Boolean
function allowAllTransfers() => Boolean
function allowAllWhitelistIssuances() => Boolean
function allowAllWhitelistTransfers() => Boolean
function factory() => Address
function getPermissions() => Bytes32[]
function issuanceAddress() => Address
function polyToken() => Address
function securityToken() => Address
function signingAddress() => Address
function whitelist(: Address) => (fromTime: UInt256, toTime: UInt256, expiryTime: UInt256, canBuyFromSTO: Boolean)

/* == Can mutate state == */
function changeAllowAllBurnTransfers(_allowAllBurnTransfers: Boolean) => void
function changeAllowAllTransfers(_allowAllTransfers: Boolean) => void
function changeAllowAllWhitelistIssuances(_allowAllWhitelistIssuances: Boolean) => void
function changeAllowAllWhitelistTransfers(_allowAllWhitelistTransfers: Boolean) => void
function changeIssuanceAddress(_issuanceAddress: Address) => void
function changeSigningAddress(_signingAddress: Address) => void
function modifyWhitelistSigned(_investor: Address, _fromTime: UInt256, _toTime: UInt256, _expiryTime: UInt256, _canBuyFromSTO: Boolean, _validFrom: UInt256, _validTo: UInt256, _v: UInt8, _r: Bytes32, _s: Bytes32) => void
function takeFee(_amount: UInt256) => Boolean
function unpause() => void
function verifyTransfer(_from: Address, _to: Address, : UInt256, : Bytes, : Boolean) => UInt8
```

</details>

## Events

```ts
event AllowAllBurnTransfers(_allowAllBurnTransfers: Boolean)
event AllowAllTransfers(_allowAllTransfers: Boolean)
event AllowAllWhitelistIssuances(_allowAllWhitelistIssuances: Boolean)
event AllowAllWhitelistTransfers(_allowAllWhitelistTransfers: Boolean)
event ChangeIssuanceAddress(_issuanceAddress: Address)
event ChangeSigningAddress(_signingAddress: Address)
event ModifyWhitelist(_investor: Address, _dateAdded: UInt256, _addedBy: Address, _fromTime: UInt256, _toTime: UInt256, _expiryTime: UInt256, _canBuyFromSTO: Boolean)
event Pause(_timestammp: UInt256)
event Unpause(_timestamp: UInt256)
```
