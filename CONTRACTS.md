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

# TickerRegistry

Keeps record of the tickers reserved by users

## Methods

```ts
/* == Read-Only methods == */
// Amount of time in seconds a ticker can be reserved
function expiryLimit() => UInt256
// Free in POLY required to register a ticker
function registrationFee() => UInt256
// Gets the details of a ticker
function getDetails(_symbol: String) => (Address, UInt256, String, Bytes32, Boolean)
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function moduleRegistry() => Address
function owner() => Address
function paused() => Boolean
function polyToken() => Address
function polymathRegistry() => Address
function securityTokenRegistry() => Address
function tickerRegistry() => Address

/* == Can mutate state == */
function changeExpiryLimit(_newExpiry: UInt256) => void
function changePolyRegistrationFee(_registrationFee: UInt256) => void
function checkValidity(_symbol: String, _owner: Address, _tokenName: String) => Boolean
function isReserved(_symbol: String, _owner: Address, _tokenName: String, _swarmHash: Bytes32) => Boolean
function pause() => void
function reclaimERC20(_tokenContract: Address) => void
function registerTicker(_owner: Address, _symbol: String, _tokenName: String, _swarmHash: Bytes32) => void
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
function unpause() => void
function updateFromRegistry() => void
```

</details>

## Events

```ts
event LogChangeExpiryLimit(_oldExpiry: UInt256, _newExpiry: UInt256)
event LogChangePolyRegistrationFee(_oldFee: UInt256, _newFee: UInt256)
event LogRegisterTicker(_owner: Address, _symbol: String, _name: String, _swarmHash: Bytes32, _timestamp: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
event Pause(_timestammp: UInt256)
event Unpause(_timestamp: UInt256)
```

# CappedSTOFactory

Factory for [CappedSTO](#CappedSTO) STO module.
Capped STOs set a limit on the total amount of funding an STO can raise.

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to setup a token with this module
function setupCost() => UInt256
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function getDescription() => String
function getInstructions() => String
function getName() => Bytes32
function getTags() => Bytes32[]
function getTitle() => String
function getType() => UInt8
function monthlySubscriptionCost() => UInt256
function owner() => Address
function polyToken() => Address
function usageCost() => UInt256

/* == Can mutate state == */
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event LogChangeFactorySetupFee(_oldSetupcost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event LogChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event LogChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event LogGenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
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
function getDescription() => String
function getInstructions() => String
function getName() => Bytes32
function getTags() => Bytes32[]
function getTitle() => String
function getType() => UInt8
function monthlySubscriptionCost() => UInt256
function owner() => Address
function polyToken() => Address
function usageCost() => UInt256

/* == Can mutate state == */
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event LogChangeFactorySetupFee(_oldSetupcost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event LogChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event LogChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event LogGenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
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
function verifyTransfer(: Address, _to: Address, : UInt256, : Boolean) => UInt8
```

</details>

## Events

```ts
event LogModifyHolderCount(_oldHolderCount: UInt256, _newHolderCount: UInt256)
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
// Pauses the moduel
function pause() => void
// Sets the maximum percent of the total tokens that one person can hold
function changeHolderPercentage(_maxHolderPercentage: UInt256) => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function FEE_ADMIN() => Bytes32
function WHITELIST() => Bytes32
function factory() => Address
function getPermissions() => Bytes32[]
function polyToken() => Address
function securityToken() => Address
function whitelist(: Address) => Boolean

/* == Can mutate state == */
function configure(_maxHolderPercentage: UInt256) => void
function takeFee(_amount: UInt256) => Boolean
function unpause() => void
function verifyTransfer(: Address, _to: Address, _amount: UInt256, : Boolean) => UInt8
```

</details>

## Events

```ts
event LogModifyHolderPercentage(_oldHolderPercentage: UInt256, _newHolderPercentage: UInt256)
event LogModifyWhitelist(_investor: Address, _dateAdded: UInt256, _addedBy: Address, _valid: Boolean)
event Pause(_timestammp: UInt256)
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
function getDescription() => String
function getInstructions() => String
function getName() => Bytes32
function getTags() => Bytes32[]
function getTitle() => String
function getType() => UInt8
function monthlySubscriptionCost() => UInt256
function owner() => Address
function polyToken() => Address
function usageCost() => UInt256

/* == Can mutate state == */
function changeFactorySetupFee(_newSetupCost: UInt256) => void
function changeFactorySubscriptionFee(_newSubscriptionCost: UInt256) => void
function changeFactoryUsageFee(_newUsageCost: UInt256) => void
function deploy(_data: Bytes) => Address
function renounceOwnership() => void
function transferOwnership(_newOwner: Address) => void
```

</details>

## Events

```ts
event LogChangeFactorySetupFee(_oldSetupcost: UInt256, _newSetupCost: UInt256, _moduleFactory: Address)
event LogChangeFactorySubscriptionFee(_oldSubscriptionCost: UInt256, _newMonthlySubscriptionCost: UInt256, _moduleFactory: Address)
event LogChangeFactoryUsageFee(_oldUsageCost: UInt256, _newUsageCost: UInt256, _moduleFactory: Address)
event LogGenerateModuleFromFactory(_module: Address, _moduleName: Bytes32, _moduleFactory: Address, _creator: Address, _timestamp: UInt256)
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
// Freezes the token
function freeze() => Boolean
// Gets a module attached to the token by name
function getModuleByName(_moduleType: UInt8, _name: Bytes32) => (Bytes32, Address)
// Gets the total amount of tokens for an address
function balanceOf(_owner: Address) => UInt256
// Name of the token
function name() => String
// Token's symbol (this is what was registered in the TickerRegistry)
function symbol() => String
// Total amount of tokens that exist in the network
function totalSupply() => UInt256

/* == Can mutate state == */
// Mints new tokens and assignes them to an `_investor` address
function mint(_investor: Address, _amount: UInt256) => success: Boolean
// Mints new tokens and assigns them to `_investors`
function mintMulti(_investors: Address[], _amounts: UInt256[]) => success: Boolean
// Sets allowance for a `spender`
function approve(_spender: Address, _value: UInt256) => Boolean
// Transfers tokens to an address
function transfer(_to: Address, _value: UInt256) => success: Boolean
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function CHECKPOINT_KEY() => UInt8
function MAX_MODULES() => UInt8
function PERMISSIONMANAGER_KEY() => UInt8
function STO_KEY() => UInt8
function TRANSFERMANAGER_KEY() => UInt8
function balanceOfAt(_investor: Address, _checkpointId: UInt256) => UInt256
function checkPermission(_delegate: Address, _module: Address, _perm: Bytes32) => Boolean
function checkpointBalances(: Address, : UInt256) => (checkpointId: UInt256, value: UInt256)
function checkpointTotalSupply(: UInt256) => (checkpointId: UInt256, value: UInt256)
function currentCheckpointId() => UInt256
function decimals() => UInt8
function finishedIssuerMinting() => Boolean
function finishedSTOMinting() => Boolean
function getInvestorsLength() => UInt256
function getModule(_moduleType: UInt8, _moduleIndex: UInt256) => (Bytes32, Address)
function granularity() => UInt256
function investorCount() => UInt256
function investorListed(: Address) => Boolean
function investors(: UInt256) => Address
function moduleRegistry() => Address
function modules(: UInt8, : UInt256) => (name: Bytes32, moduleAddress: Address)
function owner() => Address
function polyToken() => Address
function polymathRegistry() => Address
function securityTokenRegistry() => Address
function securityTokenVersion() => Bytes32
function tickerRegistry() => Address
function tokenBurner() => Address
function tokenDetails() => String
function totalSupplyAt(_checkpointId: UInt256) => UInt256

/* == Can mutate state == */
function addModule(_moduleFactory: Address, _data: Bytes, _maxCost: UInt256, _budget: UInt256) => void
function burn(_value: UInt256) => void
function changeGranularity(_granularity: UInt256) => void
function changeModuleBudget(_moduleType: UInt8, _moduleIndex: UInt8, _budget: UInt256) => void
function createCheckpoint() => UInt256
function decreaseApproval(_spender: Address, _subtractedValue: UInt256) => Boolean
function finishMintingIssuer() => void
function finishMintingSTO() => void
function freezeTransfers() => void
function increaseApproval(_spender: Address, _addedValue: UInt256) => Boolean
function pruneInvestors(_start: UInt256, _iters: UInt256) => void
function removeModule(_moduleType: UInt8, _moduleIndex: UInt8) => void
function renounceOwnership() => void
function setTokenBurner(_tokenBurner: Address) => void
function transferFrom(_from: Address, _to: Address, _value: UInt256) => success: Boolean
function transferOwnership(_newOwner: Address) => void
function unfreezeTransfers() => void
function updateFromRegistry() => void
function updateTokenDetails(_newTokenDetails: String) => void
function verifyTransfer(_from: Address, _to: Address, _amount: UInt256) => Boolean
function withdrawPoly(_amount: UInt256) => void
```

</details>

## Events

```ts
event Approval(owner: Address, spender: Address, value: UInt256)
event Burnt(_burner: Address, _value: UInt256)
event LogChangeSTRAddress(_oldAddress: Address, _newAddress: Address)
event LogCheckpointCreated(_checkpointId: UInt256, _timestamp: UInt256)
event LogFinishMintingIssuer(_timestamp: UInt256)
event LogFinishMintingSTO(_timestamp: UInt256)
event LogFreezeTransfers(_freeze: Boolean, _timestamp: UInt256)
event LogGranularityChanged(_oldGranularity: UInt256, _newGranularity: UInt256)
event LogModuleAdded(_type: UInt8, _name: Bytes32, _moduleFactory: Address, _module: Address, _moduleCost: UInt256, _budget: UInt256, _timestamp: UInt256)
event LogModuleBudgetChanged(_moduleType: UInt8, _module: Address, _budget: UInt256)
event LogModuleRemoved(_type: UInt8, _module: Address, _timestamp: UInt256)
event LogUpdateTokenDetails(_oldDetails: String, _newDetails: String)
event Minted(to: Address, amount: UInt256)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
event Transfer(from: Address, to: Address, value: UInt256)
```

# SecurityTokenRegistry

Keeps track of all the Security Tokens that exist in the network.

Through this contract Security Tokens can be created. It requires an
allowance (of at least the registration fee) to be set to be able
to create a Security Token

## Methods

```ts
/* == Read-Only methods == */
// The amount of POLY required to generate a Security Token
function registrationFee() => UInt256

/* == Can mutate state == */
// Generates a security token
function generateSecurityToken(_name: String, _symbol: String, _tokenDetails: String, _divisible: Boolean) => void
```

<details><summary>Other methods</summary>

```ts
/* == Read-Only methods == */
function getSecurityTokenAddress(_symbol: String) => Address
function getSecurityTokenData(_securityToken: Address) => (String, Address, String)
function isSecurityToken(_securityToken: Address) => Boolean
function moduleRegistry() => Address
function owner() => Address
function paused() => Boolean
function polyToken() => Address
function polymathRegistry() => Address
function protocolVersion() => Bytes32
function protocolVersionST(: Bytes32) => Address
function securityTokenRegistry() => Address
function tickerRegistry() => Address

/* == Can mutate state == */
function addCustomSecurityToken(_name: String, _symbol: String, _owner: Address, _securityToken: Address, _tokenDetails: String, _swarmHash: Bytes32) => void
function changePolyRegistrationFee(_registrationFee: UInt256) => void
function pause() => void
function reclaimERC20(_tokenContract: Address) => void
function renounceOwnership() => void
function setProtocolVersion(_stVersionProxyAddress: Address, _version: Bytes32) => void
function transferOwnership(_newOwner: Address) => void
function unpause() => void
function updateFromRegistry() => void
```

</details>

## Events

```ts
event LogAddCustomSecurityToken(_name: String, _symbol: String, _securityToken: Address, _addedAt: UInt256)
event LogChangePolyRegistrationFee(_oldFee: UInt256, _newFee: UInt256)
event LogNewSecurityToken(_ticker: String, _securityTokenAddress: Address, _owner: Address)
event OwnershipRenounced(previousOwner: Address)
event OwnershipTransferred(previousOwner: Address, newOwner: Address)
event Pause(_timestammp: UInt256)
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
function verifyTransfer(_from: Address, _to: Address, : UInt256, : Boolean) => UInt8
```

</details>

## Events

```ts
event LogAllowAllBurnTransfers(_allowAllBurnTransfers: Boolean)
event LogAllowAllTransfers(_allowAllTransfers: Boolean)
event LogAllowAllWhitelistIssuances(_allowAllWhitelistIssuances: Boolean)
event LogAllowAllWhitelistTransfers(_allowAllWhitelistTransfers: Boolean)
event LogChangeIssuanceAddress(_issuanceAddress: Address)
event LogChangeSigningAddress(_signingAddress: Address)
event LogModifyWhitelist(_investor: Address, _dateAdded: UInt256, _addedBy: Address, _fromTime: UInt256, _toTime: UInt256, _expiryTime: UInt256, _canBuyFromSTO: Boolean)
event Pause(_timestammp: UInt256)
event Unpause(_timestamp: UInt256)
```
