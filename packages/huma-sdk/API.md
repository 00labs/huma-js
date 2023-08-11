## Objects

<dl>
<dt><a href="#usePoolContract">usePoolContract</a> ⇒ <code>T</code></dt>
<dd><p>A react hook that returns a contract instance of a specific pool using an ethers provider or signer</p></dd>
<dt><a href="#ARWeaveService">ARWeaveService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma-related data stored on ARWeave</p></dd>
<dt><a href="#EAService">EAService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma's EAVerse service.</p></dd>
<dt><a href="#ReceivableService">ReceivableService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma's receivables.</p></dd>
<dt><a href="#SubgraphService">SubgraphService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma's Subgraph storage.</p></dd>
</dl>

## Functions

<dl>
<dt><a href="#defaultWrapper">defaultWrapper()</a></dt>
<dd><p>All built-in and custom scalars, mapped to their actual values</p></dd>
<dt><a href="#getERC20TransferableReceivableContract">getERC20TransferableReceivableContract(signerOrProvider, chainId)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>Returns an ethers contract instance for the ERC20TransferableReceivable contract
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#getPoolContract">getPoolContract(signerOrProvider, chainId, poolName, poolType)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>Returns an ethers contract instance for a Huma pool contract</p></dd>
<dt><a href="#getCreditRecord">getCreditRecord(address, signerOrProvider, chainId, poolName, poolType)</a> ⇒ <code>Promise.&lt;CreditRecord&gt;</code></dt>
<dd><p>Gets the credit record of a wallet in a Huma pool. Denominated in the ERC20 tokens of the pool.</p></dd>
<dt><a href="#getTotalDue">getTotalDue(address, signerOrProvider, chainId, poolName, poolType)</a> ⇒ <code>Promise.&lt;BigNumber&gt;</code></dt>
<dd><p>Gets the total due for a Huma pool of the given wallet. Denominated in the ERC20 tokens of the pool.</p></dd>
<dt><a href="#drawdownFromPool">drawdownFromPool(signer, chainId, poolName, poolType, drawdownAmount, [gasOpts])</a> ⇒ <code>Promise.&lt;TransactionResponse&gt;</code></dt>
<dd><p>Calls drawdown on a Huma pool contract</p></dd>
<dt><a href="#makePaymentToPool">makePaymentToPool(signer, chainId, poolName, poolType, paymentAmount, [gasOpts])</a> ⇒ <code>Promise.&lt;TransactionResponse&gt;</code></dt>
<dd><p>Calls makePayment on a Huma pool contract. If the pool does not have sufficient allowance to complete the operation,
attempt to first increase the allowance of the pool.</p></dd>
<dt><a href="#approvePoolAllowance">approvePoolAllowance(signer, chainId, poolName, poolType, allowanceAmount, [gasOpts])</a> ⇒ <code>Promise.&lt;TransactionResponse&gt;</code></dt>
<dd><p>Approves an allowance for a Huma pool contract, which is required to do certain actions (e.g. makePayment)</p></dd>
<dt><a href="#getRealWorldReceivableContract">getRealWorldReceivableContract(signerOrProvider, chainId)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>Returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#useContract">useContract(address, ABI, signerOrProvider)</a> ⇒ <code>T</code> | <code>null</code></dt>
<dd><p>Custom hook for creating an ethers instance of a smart contract.</p></dd>
<dt><a href="#useERC20TransferableReceivableContract">useERC20TransferableReceivableContract(signerOrProvider, chainId, poolName)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>A react hook that returns an ethers contract instance for the ERC20TransferableReceivable contract
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#useRealWorldReceivableContract">useRealWorldReceivableContract(signerOrProvider, chainId)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>A react hook that returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p></dd>
<dt><a href="#preapprove">preapprove(payload, chainId)</a> ⇒ <code>Promise.&lt;Approval&gt;</code></dt>
<dd><p>Checks whether or not a credit underwriting request to Huma's EAVerse would be approved.
Note that this does not approve a creditline in Huma's pools and an approve call is still required.</p></dd>
<dt><a href="#getChainIdFromJsonSignerOrProvider">getChainIdFromJsonSignerOrProvider(signerOrProvider)</a> ⇒ <code>number</code></dt>
<dd><p>Get the chain ID from a signer or provider object.</p></dd>
<dt><a href="#getChainIdFromSignerOrProvider">getChainIdFromSignerOrProvider(signerOrProvider)</a> ⇒ <code>number</code></dt>
<dd><p>Get the chain ID from a signer or provider object.</p></dd>
<dt><a href="#getPoolInfo">getPoolInfo(poolName, poolType)</a> ⇒ <code>PoolInfoType</code> | <code>undefined</code></dt>
<dd><p>Returns the pool info based on the provided pool name and type, using the same chain ID as the provider/signer given</p></dd>
<dt><a href="#getRealWorldReceivableContract">getRealWorldReceivableContract(signerOrProvider, chainId)</a> ⇒ <code>Contract</code> | <code>null</code></dt>
<dd><p>Returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p></dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ApprovalResult">ApprovalResult</a> : <code>Object</code></dt>
<dd><p>Object representing the response to the underwriting approval request.</p></dd>
<dt><a href="#EAPayload">EAPayload</a> : <code>Object</code></dt>
<dd><p>Object representing an invoice payload for underwriting approval.</p></dd>
<dt><a href="#CreditEventPayload">CreditEventPayload</a> : <code>Object</code></dt>
<dd><p>Represents the payload of a credit event.</p></dd>
</dl>

<a name="usePoolContract"></a>

## usePoolContract ⇒ <code>T</code>
<p>A react hook that returns a contract instance of a specific pool using an ethers provider or signer</p>

**Kind**: global namespace  
**Returns**: <code>T</code> - <p>A contract instance of the specific pool.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>An ethers signer or provider instance.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool.</p> |


* [usePoolContract](#usePoolContract) ⇒ <code>T</code>
    * [.useCreditRecordDetails(userAddress, signerOrProvider, chainId, poolName, poolType)](#usePoolContract.useCreditRecordDetails) ⇒ <code>Array.&lt;(CreditRecordDetails\|undefined), function(): void&gt;</code>
    * [.CreditRecordDetails](#usePoolContract.CreditRecordDetails) : <code>Object</code>

<a name="usePoolContract.useCreditRecordDetails"></a>

### usePoolContract.useCreditRecordDetails(userAddress, signerOrProvider, chainId, poolName, poolType) ⇒ <code>Array.&lt;(CreditRecordDetails\|undefined), function(): void&gt;</code>
<p>A react hook that returns the credit record details for a user in a given pool, as well as a function to refresh the data.</p>

**Kind**: static method of [<code>usePoolContract</code>](#usePoolContract)  
**Returns**: <code>Array.&lt;(CreditRecordDetails\|undefined), function(): void&gt;</code> - <p>An array containing the credit record details and a function to refresh the data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| userAddress | <code>string</code> | <p>The address of the user to get the credit record details for.</p> |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The signer or provider object to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool to get the credit record details for.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool.</p> |

<a name="usePoolContract.CreditRecordDetails"></a>

### usePoolContract.CreditRecordDetails : <code>Object</code>
<p>CreditRecordDetails type object representing the details of a credit line.</p>

**Kind**: static typedef of [<code>usePoolContract</code>](#usePoolContract)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| aprInBps | <code>number</code> | <p>The APR (annual percentage rate) in basis points.</p> |
| correction | <code>BigNumber</code> | <p>adjustment of interest over or under-counted because of drawdown or principal payment in the middle of a billing period</p> |
| creditLimit | <code>BigNumber</code> | <p>The credit limit in the pools base currency.</p> |
| defaultAmount | <code>BigNumber</code> | <p>The amount of the default, if any.</p> |
| dueDate | <code>BigNumber</code> | <p>The due date of the next payment.</p> |
| feesAndInterestDue | <code>BigNumber</code> | <p>The fees and interest due.</p> |
| intervalInDays | <code>number</code> | <p>The interval in days between payment periods.</p> |
| missedPeriods | <code>number</code> | <p>The number of missed periods.</p> |
| remainingPeriods | <code>number</code> | <p>The number of remaining periods before this credit line is considered paid off.</p> |
| state | <code>number</code> | <p>The state of the factorization. Please see the CreditState in huma-contracts for more details.</p> |
| totalDue | <code>BigNumber</code> | <p>The total due amount of this credit line.</p> |
| unbilledPrincipal | <code>BigNumber</code> | <p>The unbilled principal of the next payment.</p> |

<a name="ARWeaveService"></a>

## ARWeaveService : <code>object</code>
<p>An object that contains functions to interact with Huma-related data stored on ARWeave</p>

**Kind**: global namespace  
<a name="EAService"></a>

## EAService : <code>object</code>
<p>An object that contains functions to interact with Huma's EAVerse service.</p>

**Kind**: global namespace  
<a name="EAService.approve"></a>

### EAService.approve(payload, chainId) ⇒ <code>Promise.&lt;Approval&gt;</code>
<p>Submits a credit underwriting request to Huma's EAVerse. This approves a creditline
in Huma's pools that can be drawn down by the borrower.</p>

**Kind**: static method of [<code>EAService</code>](#EAService)  
**Returns**: <code>Promise.&lt;Approval&gt;</code> - <p>Promise that returns the approval on success.</p>  
**Throws**:

- <code>EARejectionError</code> <p>If the underwrite approval is rejected.</p>


| Param | Type | Description |
| --- | --- | --- |
| payload | [<code>EAPayload</code>](#EAPayload) | <p>The payload for the underwrite approval.</p> |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="ReceivableService"></a>

## ReceivableService : <code>object</code>
<p>An object that contains functions to interact with Huma's receivables.</p>

**Kind**: global namespace  

* [ReceivableService](#ReceivableService) : <code>object</code>
    * [.getTokenIdByARWeaveId(signer, arweaveId)](#ReceivableService.getTokenIdByARWeaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
    * [.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByReferenceId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByTokenId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts])](#ReceivableService.createReceivable) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts])](#ReceivableService.createReceivableWithMetadata) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType)](#ReceivableService.loadReceivablesOfOwnerWithMetadata) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>

<a name="ReceivableService.getTokenIdByARWeaveId"></a>

### ReceivableService.getTokenIdByARWeaveId(signer, arweaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
<p>Declares a payment on a RealWorldReceivable given a reference Id of the receivable, which was used as an index for ARWeave data.</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;(string\|null\|undefined)&gt;</code> - <ul>
<li>Either the token Id or null if no token was found.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to lookup metadata uploads for</p> |
| arweaveId | <code>string</code> | <p>The internal ARWeave identifier to lookup a token by</p> |

<a name="ReceivableService.declareReceivablePaymentByReferenceId"></a>

### ReceivableService.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Declares a payment on a RealWorldReceivable given a reference Id of the receivable, which was used as an index for ARWeave data.</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction receipt.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction. Note only the receivable owner can pay the receivable.</p> |
| referenceId | <code>string</code> | <p>An internal identifier value added as a tag on ARWeave</p> |
| paymentAmount | <code>number</code> | <p>The amount to declare paid to the receivable.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="ReceivableService.declareReceivablePaymentByTokenId"></a>

### ReceivableService.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Declares a payment on a RealWorldReceivable given a tokenId of the receivable.</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction receipt.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network.</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction. Note only the receivable owner can pay the receivable.</p> |
| receivableTokenId | <code>BigNumberish</code> | <p>The Id of the receivable token to pay.</p> |
| paymentAmount | <code>number</code> | <p>The amount to pay the receivable.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="ReceivableService.createReceivable"></a>

### ReceivableService.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Creates a new RealWorldReceivable token on the given chain of the signer</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network.</li>
</ul>


| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| currencyCode | <code>number</code> | <p>The ISO 4217 currency code that the receivable is denominated in</p> |
| receivableAmount | <code>number</code> | <p>The amount of the receivable token to mint.</p> |
| maturityDate | <code>number</code> | <p>The maturity date of the receivable token, in UNIX timestamp format.</p> |
| uri | <code>string</code> | <p>The URI of the receivable token metadata.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="ReceivableService.createReceivableWithMetadata"></a>

### ReceivableService.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Creates a RealWorldReceivable token with metadata uploaded onto ARWeave</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>The transaction receipt.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> |  | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| privateKey | <code>string</code> \| <code>null</code> |  | <p>Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.</p> |
| chainId | <code>number</code> |  | <p>The chain ID to mint the receivable token on and pay ARWeave funds from.</p> |
| poolName | <code>POOL\_NAME</code> |  | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> |  | <p>The pool type. Used to lookup the pool address to pay to.</p> |
| currencyCode | <code>number</code> |  | <p>The ISO 4217 currency code that the receivable is denominated in</p> |
| receivableAmount | <code>number</code> |  | <p>The receivable amount.</p> |
| maturityDate | <code>number</code> |  | <p>The maturity date of the receivable, in UNIX timestamp format.</p> |
| metadata | <code>Record.&lt;string, any&gt;</code> |  | <p>The metadata in JSON format. This will be uploaded onto ARWeave</p> |
| referenceId | <code>number</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
| extraTags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Any extraTags you'd like to tag your metadata with. Note that metadata on ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.</p> |
| [gasOpts] | <code>Overrides</code> |  | <p>Optional gas overrides for the transaction.</p> |

<a name="ReceivableService.loadReceivablesOfOwnerWithMetadata"></a>

### ReceivableService.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>
<p>Loads all RWRs belonging to the specified owner, including the RWR metadata</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code> - <ul>
<li>An array of receivables owned by the owner for the pool.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| owner | <code>string</code> | <p>The receivable token owner to query from.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The pool type. Used to lookup the pool address to pay to.</p> |

<a name="SubgraphService"></a>

## SubgraphService : <code>object</code>
<p>An object that contains functions to interact with Huma's Subgraph storage.</p>

**Kind**: global namespace  

* [SubgraphService](#SubgraphService) : <code>object</code>
    * [.getSubgraphUrlForChainId(chainId)](#SubgraphService.getSubgraphUrlForChainId) ⇒ <code>string</code>
    * [.getCreditEventsForUser(userAddress, chainId, poolName, poolType, event)](#SubgraphService.getCreditEventsForUser) ⇒ <code>Promise.&lt;Array.&lt;CreditEventPayload&gt;&gt;</code>
    * [.getLastFactorizedAmountFromPool(userAddress, chainId, poolName, poolType)](#SubgraphService.getLastFactorizedAmountFromPool) ⇒ <code>Promise.&lt;number&gt;</code>

<a name="SubgraphService.getSubgraphUrlForChainId"></a>

### SubgraphService.getSubgraphUrlForChainId(chainId) ⇒ <code>string</code>
<p>Returns the subgraph URL for a given chain ID.</p>

**Kind**: static method of [<code>SubgraphService</code>](#SubgraphService)  
**Returns**: <code>string</code> - <p>The subgraph URL for the given chain ID.</p>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The ID of the chain.</p> |

<a name="SubgraphService.getCreditEventsForUser"></a>

### SubgraphService.getCreditEventsForUser(userAddress, chainId, poolName, poolType, event) ⇒ <code>Promise.&lt;Array.&lt;CreditEventPayload&gt;&gt;</code>
<p>Returns the credit events for a given user.</p>

**Kind**: static method of [<code>SubgraphService</code>](#SubgraphService)  
**Returns**: <code>Promise.&lt;Array.&lt;CreditEventPayload&gt;&gt;</code> - <p>The credit events for the given user.</p>  

| Param | Type | Description |
| --- | --- | --- |
| userAddress | <code>string</code> | <p>The address of the user.</p> |
| chainId | <code>number</code> | <p>The ID of the chain.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool.</p> |
| event | <code>Array.&lt;number&gt;</code> | <p>The event types to filter by.</p> |

<a name="SubgraphService.getLastFactorizedAmountFromPool"></a>

### SubgraphService.getLastFactorizedAmountFromPool(userAddress, chainId, poolName, poolType) ⇒ <code>Promise.&lt;number&gt;</code>
<p>Returns the last factorized amount for a given user and pool.</p>

**Kind**: static method of [<code>SubgraphService</code>](#SubgraphService)  
**Returns**: <code>Promise.&lt;number&gt;</code> - <p>The last factorized amount for the given user and pool.</p>  

| Param | Type | Description |
| --- | --- | --- |
| userAddress | <code>string</code> | <p>The address of the user.</p> |
| chainId | <code>number</code> | <p>The ID of the chain.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool.</p> |

<a name="defaultWrapper"></a>

## defaultWrapper()
<p>All built-in and custom scalars, mapped to their actual values</p>

**Kind**: global function  
<a name="getERC20TransferableReceivableContract"></a>

## getERC20TransferableReceivableContract(signerOrProvider, chainId) ⇒ <code>Contract</code> \| <code>null</code>
<p>Returns an ethers contract instance for the ERC20TransferableReceivable contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the ERC20TransferableReceivable contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |

<a name="getPoolContract"></a>

## getPoolContract(signerOrProvider, chainId, poolName, poolType) ⇒ <code>Contract</code> \| <code>null</code>
<p>Returns an ethers contract instance for a Huma pool contract</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the Pool contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool contract to get.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool contract to get.</p> |

<a name="getCreditRecord"></a>

## getCreditRecord(address, signerOrProvider, chainId, poolName, poolType) ⇒ <code>Promise.&lt;CreditRecord&gt;</code>
<p>Gets the credit record of a wallet in a Huma pool. Denominated in the ERC20 tokens of the pool.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;CreditRecord&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | <p>The address to lookup.</p> |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The signer or provider used to read data.</p> |
| chainId | <code>number</code> | <p>The chain ID of the pool. Used to lookup the pool address.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool. Used to lookup the pool address.</p> |

<a name="getCreditRecord.CreditRecord"></a>

### getCreditRecord.CreditRecord : <code>Object</code>
<p>Return type of getCreditRecord</p>

**Kind**: static typedef of [<code>getCreditRecord</code>](#getCreditRecord)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| unbilledPrincipal | <code>BigNumber</code> | <p>The amount of principal not included in the bill</p> |
| dueDate | <code>BigNumber</code> | <p>Unix timestamp due date of the next payment</p> |
| correction | <code>BigNumber</code> | <p>the adjustment of interest over or under-counted because of drawdown or principal payment in the middle of a billing period</p> |
| totalDue | <code>BigNumber</code> | <p>The due amount of the next payment</p> |
| feesAndInterestDue | <code>BigNumber</code> | <p>Interest and fees due for the next payment</p> |
| missedPeriods | <code>number</code> | <h1>of consecutive missed payments, for default processing</h1> |
| remainingPeriods | <code>number</code> | <h1>of payment periods until the maturity of the credit line</h1> |
| state | <code>number</code> | <p>status of the credit line. For more info: https://github.com/00labs/huma-contracts/blob/b075a8f957de281e0885e37dbd72a422b6a54a38/contracts/libraries/BaseStructs.sol#L49</p> |

<a name="getTotalDue"></a>

## getTotalDue(address, signerOrProvider, chainId, poolName, poolType) ⇒ <code>Promise.&lt;BigNumber&gt;</code>
<p>Gets the total due for a Huma pool of the given wallet. Denominated in the ERC20 tokens of the pool.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;BigNumber&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> | <p>The address to lookup.</p> |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The signer or provider used to read data.</p> |
| chainId | <code>number</code> | <p>The chain ID of the pool. Used to lookup the pool address.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool. Used to lookup the pool address.</p> |

<a name="drawdownFromPool"></a>

## drawdownFromPool(signer, chainId, poolName, poolType, drawdownAmount, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Calls drawdown on a Huma pool contract</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction.</p> |
| chainId | <code>number</code> | <p>The chain ID of the pool to call drawdown on. Used to lookup the pool address.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| drawdownAmount | <code>BigNumberish</code> | <p>The amount of tokens to withdraw, denominated in the ERC20 tokens of the pool.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="makePaymentToPool"></a>

## makePaymentToPool(signer, chainId, poolName, poolType, paymentAmount, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Calls makePayment on a Huma pool contract. If the pool does not have sufficient allowance to complete the operation,
attempt to first increase the allowance of the pool.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction.</p> |
| chainId | <code>number</code> | <p>The chain ID of the pool to call drawdown on. Used to lookup the pool address.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| paymentAmount | <code>BigNumberish</code> | <p>The amount of tokens to payback, denominated in the ERC20 tokens of the pool.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="approvePoolAllowance"></a>

## approvePoolAllowance(signer, chainId, poolName, poolType, allowanceAmount, [gasOpts]) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
<p>Approves an allowance for a Huma pool contract, which is required to do certain actions (e.g. makePayment)</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;TransactionResponse&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signer | <code>ethers.Signer</code> | <p>The signer used to send the transaction.</p> |
| chainId | <code>number</code> | <p>The chain ID of the pool to call drawdown on. Used to lookup the pool address.</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the credit pool to mint the receivable token from. Used to lookup the pool address.</p> |
| allowanceAmount | <code>BigNumberish</code> | <p>The amount of tokens to payback, denominated in the ERC20 tokens of the pool.</p> |
| [gasOpts] | <code>Overrides</code> | <p>The gas options to use for the transaction.</p> |

<a name="getRealWorldReceivableContract"></a>

## getRealWorldReceivableContract(signerOrProvider, chainId) ⇒ <code>Contract</code> \| <code>null</code>
<p>Returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the RealWorldReceivable contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |

<a name="useContract"></a>

## useContract(address, ABI, signerOrProvider) ⇒ <code>T</code> \| <code>null</code>
<p>Custom hook for creating an ethers instance of a smart contract.</p>

**Kind**: global function  
**Returns**: <code>T</code> \| <code>null</code> - <p>An instance of the smart contract, or null if an error occurs.</p>  

| Param | Type | Description |
| --- | --- | --- |
| address | <code>string</code> \| <code>null</code> \| <code>undefined</code> | <p>The address of the smart contract instance.</p> |
| ABI | <code>any</code> | <p>The ABI of the smart contract.</p> |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The signer or provider used to sign transactions or retrieve blockchain data. Note that this signerOrProvider must be connected to the same network as the smart contract in question.</p> |

<a name="useERC20TransferableReceivableContract"></a>

## useERC20TransferableReceivableContract(signerOrProvider, chainId, poolName) ⇒ <code>Contract</code> \| <code>null</code>
<p>A react hook that returns an ethers contract instance for the ERC20TransferableReceivable contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the ERC20TransferableReceivable contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool to get the contract for.</p> |

<a name="useRealWorldReceivableContract"></a>

## useRealWorldReceivableContract(signerOrProvider, chainId) ⇒ <code>Contract</code> \| <code>null</code>
<p>A react hook that returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the RealWorldReceivable contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |

<a name="preapprove"></a>

## preapprove(payload, chainId) ⇒ <code>Promise.&lt;Approval&gt;</code>
<p>Checks whether or not a credit underwriting request to Huma's EAVerse would be approved.
Note that this does not approve a creditline in Huma's pools and an approve call is still required.</p>

**Kind**: global function  
**Returns**: <code>Promise.&lt;Approval&gt;</code> - <p>Promise that returns the approval on success.</p>  

| Param | Type | Description |
| --- | --- | --- |
| payload | <code>EAPreapprovalPayload</code> | <p>The payload for the underwrite approval.</p> |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="getChainIdFromJsonSignerOrProvider"></a>

## getChainIdFromJsonSignerOrProvider(signerOrProvider) ⇒ <code>number</code>
<p>Get the chain ID from a signer or provider object.</p>

**Kind**: global function  
**Returns**: <code>number</code> - <ul>
<li>The chain ID.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>JsonRpcProvider</code> \| <code>JsonRpcSigner</code> | <p>The signer or provider object to get the chain ID from.</p> |

<a name="getChainIdFromSignerOrProvider"></a>

## getChainIdFromSignerOrProvider(signerOrProvider) ⇒ <code>number</code>
<p>Get the chain ID from a signer or provider object.</p>

**Kind**: global function  
**Returns**: <code>number</code> - <ul>
<li>The chain ID.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.provider.Provider</code> \| <code>ethers.Signer</code> | <p>The signer or provider object to get the chain ID from.</p> |

<a name="getPoolInfo"></a>

## getPoolInfo(poolName, poolType) ⇒ <code>PoolInfoType</code> \| <code>undefined</code>
<p>Returns the pool info based on the provided pool name and type, using the same chain ID as the provider/signer given</p>

**Kind**: global function  
**Returns**: <code>PoolInfoType</code> \| <code>undefined</code> - <ul>
<li>The pool info or undefined if the chain ID is not supported.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| poolName | <code>POOL\_NAME</code> | <p>The name of the pool.</p> |
| poolType | <code>POOL\_TYPE</code> | <p>The type of the pool.</p> |

<a name="getRealWorldReceivableContract"></a>

## getRealWorldReceivableContract(signerOrProvider, chainId) ⇒ <code>Contract</code> \| <code>null</code>
<p>Returns an ethers contract instance for the RealWorldReceivable contract
associated with the given pool name on the current chain.</p>

**Kind**: global function  
**Returns**: <code>Contract</code> \| <code>null</code> - <p>A contract instance for the RealWorldReceivable contract or null if it could not be found.</p>  

| Param | Type | Description |
| --- | --- | --- |
| signerOrProvider | <code>ethers.providers.Provider</code> \| <code>ethers.Signer</code> | <p>The provider or signer instance to use for the contract.</p> |
| chainId | <code>number</code> | <p>The chain id where the contract instance exists</p> |

<a name="ApprovalResult"></a>

## ApprovalResult : <code>Object</code>
<p>Object representing the response to the underwriting approval request.</p>

**Kind**: global typedef  
<a name="EAPayload"></a>

## EAPayload : <code>Object</code>
<p>Object representing an invoice payload for underwriting approval.</p>

**Kind**: global typedef  
<a name="CreditEventPayload"></a>

## CreditEventPayload : <code>Object</code>
<p>Represents the payload of a credit event.</p>

**Kind**: global typedef  
