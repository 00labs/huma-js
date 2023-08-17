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
<dt><a href="#ARWeaveService">ARWeaveService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma-related data stored on ARWeave</p></dd>
<dt><a href="#ReceivableService">ReceivableService</a> : <code>object</code></dt>
<dd><p>An object that contains functions to interact with Huma's receivables.</p></dd>
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

* [ARWeaveService](#ARWeaveService) : <code>object</code>
    * [.getBundlrNetworkConfig(chainId)](#ARWeaveService.getBundlrNetworkConfig) ⇒ <code>BundlrConfig</code>
    * [.getBundlrInstance(config, signer)](#ARWeaveService.getBundlrInstance) ⇒
    * [.prefundBundlr(config, signer, amount)](#ARWeaveService.prefundBundlr) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
    * [.storeData(config, signerOrPrivateKey, data, tags, [lazyFund])](#ARWeaveService.storeData) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
    * [.queryForMetadata(chainId, sender, referenceId)](#ARWeaveService.queryForMetadata) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.fetchMetadataFromUrl(url)](#ARWeaveService.fetchMetadataFromUrl) ⇒ <code>Promise.&lt;JSON&gt;</code>
    * [.getURIFromARWeaveId(arweaveId)](#ARWeaveService.getURIFromARWeaveId) ⇒ <code>string</code>
    * [.getBundlrNetworkConfig(chainId)](#ARWeaveService.getBundlrNetworkConfig) ⇒ <code>BundlrConfig</code>
    * [.getBundlrInstance(config, signer)](#ARWeaveService.getBundlrInstance) ⇒
    * [.prefundBundlr(config, signer, amount)](#ARWeaveService.prefundBundlr) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
    * [.storeData(config, signerOrPrivateKey, data, tags, [lazyFund])](#ARWeaveService.storeData) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
    * [.queryForMetadata(chainId, sender, referenceId)](#ARWeaveService.queryForMetadata) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.fetchMetadataFromUrl(url)](#ARWeaveService.fetchMetadataFromUrl) ⇒ <code>Promise.&lt;JSON&gt;</code>
    * [.getURIFromARWeaveId(arweaveId)](#ARWeaveService.getURIFromARWeaveId) ⇒ <code>string</code>
    * [.BundlrConfig](#ARWeaveService.BundlrConfig) : <code>Object</code>
    * [.BundlrConfig](#ARWeaveService.BundlrConfig) : <code>Object</code>

<a name="ARWeaveService.getBundlrNetworkConfig"></a>

### ARWeaveService.getBundlrNetworkConfig(chainId) ⇒ <code>BundlrConfig</code>
<p>Get the configuration for Bundlr network given a chain ID</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>BundlrConfig</code> - <ul>
<li>The configuration for the Bundlr network.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="ARWeaveService.getBundlrInstance"></a>

### ARWeaveService.getBundlrInstance(config, signer) ⇒
<p>Get a Bundlr instance for a specific network</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <p>The Bundlr instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to use Bundlr with.</p> |

<a name="ARWeaveService.prefundBundlr"></a>

### ARWeaveService.prefundBundlr(config, signer, amount) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
<p>Prefund the Bundlr network with the specified amount. Required if not lazy funding.
Important note: The amount is denominated in the base unit of currency for that network.
If you want to upload 5 Matic to the Bundlr node, pass in an amount of 5.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;FundResponse&gt;</code> - <ul>
<li>The fund response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to send funds from.</p> |
| amount | <code>number</code> | <p>The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)</p> |

<a name="ARWeaveService.storeData"></a>

### ARWeaveService.storeData(config, signerOrPrivateKey, data, tags, [lazyFund]) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
<p>Store data on ARWeave using the Bundlr Network.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;UploadResponse&gt;</code> - <p>Promise resolving with the upload response.</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>BundlrConfig</code> |  | <p>Configuration object for the Bundlr instance.</p> |
| signerOrPrivateKey | <code>Web3Provider</code> \| <code>string</code> |  | <p>Wallet object used for interacting with the Bundlr instance. If calling from a browser, this should be a <code>Web3Provider</code> instance. If calling from a Node.js environment, this should be a private key string.</p> |
| data | <code>Record.&lt;string, unknown&gt;</code> |  | <p>The data to store in the Bundlr instance.</p> |
| tags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Array of tag objects with <code>name</code> and <code>value</code> properties.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Optional flag to fund the Bundlr instance lazily. If set to <code>false</code>, the Bundlr node should already be funded or else uploads will fail.</p> |

<a name="ARWeaveService.queryForMetadata"></a>

### ARWeaveService.queryForMetadata(chainId, sender, referenceId) ⇒ <code>Promise.&lt;any&gt;</code>
<p>Helper method to query the Arweave network for receivables metadata previously uploaded.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;any&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |
| sender | <code>string</code> | <p>The sender tag to query.</p> |
| referenceId | <code>string</code> | <p>The referenceId tag to query, whatever was used when uploading the metadata.</p> |

<a name="ARWeaveService.fetchMetadataFromUrl"></a>

### ARWeaveService.fetchMetadataFromUrl(url) ⇒ <code>Promise.&lt;JSON&gt;</code>
<p>Helper method to fetch data from an ARWeave URL.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;JSON&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | <p>The ARWeave metadata URL to query.</p> |

<a name="ARWeaveService.getURIFromARWeaveId"></a>

### ARWeaveService.getURIFromARWeaveId(arweaveId) ⇒ <code>string</code>
<p>Helper method to get an ARWeave URI from an ARWeave ID.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>string</code> - <p>The ARWeave URI.</p>  

| Param | Type | Description |
| --- | --- | --- |
| arweaveId | <code>string</code> | <p>The ARWeave metadata ID.</p> |

<a name="ARWeaveService.getBundlrNetworkConfig"></a>

### ARWeaveService.getBundlrNetworkConfig(chainId) ⇒ <code>BundlrConfig</code>
<p>Get the configuration for Bundlr network given a chain ID</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>BundlrConfig</code> - <ul>
<li>The configuration for the Bundlr network.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="ARWeaveService.getBundlrInstance"></a>

### ARWeaveService.getBundlrInstance(config, signer) ⇒
<p>Get a Bundlr instance for a specific network</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <p>The Bundlr instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to use Bundlr with.</p> |

<a name="ARWeaveService.prefundBundlr"></a>

### ARWeaveService.prefundBundlr(config, signer, amount) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
<p>Prefund the Bundlr network with the specified amount. Required if not lazy funding.
Important note: The amount is denominated in the base unit of currency for that network.
If you want to upload 5 Matic to the Bundlr node, pass in an amount of 5.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;FundResponse&gt;</code> - <ul>
<li>The fund response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to send funds from.</p> |
| amount | <code>number</code> | <p>The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)</p> |

<a name="ARWeaveService.storeData"></a>

### ARWeaveService.storeData(config, signerOrPrivateKey, data, tags, [lazyFund]) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
<p>Store data on ARWeave using the Bundlr Network.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;UploadResponse&gt;</code> - <p>Promise resolving with the upload response.</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>BundlrConfig</code> |  | <p>Configuration object for the Bundlr instance.</p> |
| signerOrPrivateKey | <code>Web3Provider</code> \| <code>string</code> |  | <p>Wallet object used for interacting with the Bundlr instance. If calling from a browser, this should be a <code>Web3Provider</code> instance. If calling from a Node.js environment, this should be a private key string.</p> |
| data | <code>Record.&lt;string, unknown&gt;</code> |  | <p>The data to store in the Bundlr instance.</p> |
| tags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Array of tag objects with <code>name</code> and <code>value</code> properties.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Optional flag to fund the Bundlr instance lazily. If set to <code>false</code>, the Bundlr node should already be funded or else uploads will fail.</p> |

<a name="ARWeaveService.queryForMetadata"></a>

### ARWeaveService.queryForMetadata(chainId, sender, referenceId) ⇒ <code>Promise.&lt;any&gt;</code>
<p>Helper method to query the Arweave network for receivables metadata previously uploaded.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;any&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |
| sender | <code>string</code> | <p>The sender tag to query.</p> |
| referenceId | <code>string</code> | <p>The referenceId tag to query, whatever was used when uploading the metadata.</p> |

<a name="ARWeaveService.fetchMetadataFromUrl"></a>

### ARWeaveService.fetchMetadataFromUrl(url) ⇒ <code>Promise.&lt;JSON&gt;</code>
<p>Helper method to fetch data from an ARWeave URL.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;JSON&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | <p>The ARWeave metadata URL to query.</p> |

<a name="ARWeaveService.getURIFromARWeaveId"></a>

### ARWeaveService.getURIFromARWeaveId(arweaveId) ⇒ <code>string</code>
<p>Helper method to get an ARWeave URI from an ARWeave ID.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>string</code> - <p>The ARWeave URI.</p>  

| Param | Type | Description |
| --- | --- | --- |
| arweaveId | <code>string</code> | <p>The ARWeave metadata ID.</p> |

<a name="ARWeaveService.BundlrConfig"></a>

### ARWeaveService.BundlrConfig : <code>Object</code>
<p>The configuration for Bundlr network instances</p>

**Kind**: static typedef of [<code>ARWeaveService</code>](#ARWeaveService)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| nodeUrl | <code>string</code> | <p>The Bundlr node URL to use.</p> |
| currency | <code>string</code> | <p>The currency to pay for uploads with. Please see https://docs.bundlr.network/sdk/using-other-currencies for all the supported currencies</p> |
| [providerUrl] | <code>string</code> | <p>The provider URL, required for devnets.</p> |

<a name="ARWeaveService.BundlrConfig"></a>

### ARWeaveService.BundlrConfig : <code>Object</code>
<p>The configuration for Bundlr network instances</p>

**Kind**: static typedef of [<code>ARWeaveService</code>](#ARWeaveService)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| nodeUrl | <code>string</code> | <p>The Bundlr node URL to use.</p> |
| currency | <code>string</code> | <p>The currency to pay for uploads with. Please see https://docs.bundlr.network/sdk/using-other-currencies for all the supported currencies</p> |
| [providerUrl] | <code>string</code> | <p>The provider URL, required for devnets.</p> |

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
    * [.getTokenIdByURI(signer, arweaveId)](#ReceivableService.getTokenIdByURI) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
    * [.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByReferenceId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByTokenId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts])](#ReceivableService.createReceivable) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
    * [.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund])](#ReceivableService.uploadOrFetchMetadataURI) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts])](#ReceivableService.createReceivableWithMetadata) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType)](#ReceivableService.loadReceivablesOfOwnerWithMetadata) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>
    * [.getTokenIdByURI(signer, arweaveId)](#ReceivableService.getTokenIdByURI) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
    * [.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByReferenceId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByTokenId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts])](#ReceivableService.createReceivable) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
    * [.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund])](#ReceivableService.uploadOrFetchMetadataURI) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts])](#ReceivableService.createReceivableWithMetadata) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType)](#ReceivableService.loadReceivablesOfOwnerWithMetadata) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>

<a name="ReceivableService.getTokenIdByURI"></a>

### ReceivableService.getTokenIdByURI(signer, arweaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
<p>Fetches the tokenId of a RealWorldReceivable, or null if it doesn't exist, given a metadata URI</p>

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

### ReceivableService.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts]) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
<p>Creates a new RealWorldReceivable token on the given chain of the signer</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;(TransactionResponse\|null)&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network, or if a token already exists with the same metadata URI.</li>
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

<a name="ReceivableService.uploadOrFetchMetadataURI"></a>

### ReceivableService.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund]) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Uploads metadata onto ARWeave (or fetches the existing metadata with the same reference Id) and returns the ARWeave URL</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <ul>
<li>The ARWeave metadata URI.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> |  | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| privateKey | <code>string</code> \| <code>null</code> |  | <p>Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.</p> |
| chainId | <code>number</code> |  | <p>The chain ID to mint the receivable token on and pay ARWeave funds from.</p> |
| poolName | <code>POOL\_NAME</code> |  | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> |  | <p>The pool type. Used to lookup the pool address to pay to.</p> |
| metadata | <code>Record.&lt;string, any&gt;</code> |  | <p>The metadata in JSON format. This will be uploaded onto ARWeave</p> |
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
| extraTags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Any extraTags you'd like to tag your metadata with. Note that metadata on ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.</p> |

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
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
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

<a name="ReceivableService.getTokenIdByURI"></a>

### ReceivableService.getTokenIdByURI(signer, arweaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
<p>Fetches the tokenId of a RealWorldReceivable, or null if it doesn't exist, given a metadata URI</p>

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

### ReceivableService.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts]) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
<p>Creates a new RealWorldReceivable token on the given chain of the signer</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;(TransactionResponse\|null)&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network, or if a token already exists with the same metadata URI.</li>
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

<a name="ReceivableService.uploadOrFetchMetadataURI"></a>

### ReceivableService.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund]) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Uploads metadata onto ARWeave (or fetches the existing metadata with the same reference Id) and returns the ARWeave URL</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <ul>
<li>The ARWeave metadata URI.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> |  | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| privateKey | <code>string</code> \| <code>null</code> |  | <p>Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.</p> |
| chainId | <code>number</code> |  | <p>The chain ID to mint the receivable token on and pay ARWeave funds from.</p> |
| poolName | <code>POOL\_NAME</code> |  | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> |  | <p>The pool type. Used to lookup the pool address to pay to.</p> |
| metadata | <code>Record.&lt;string, any&gt;</code> |  | <p>The metadata in JSON format. This will be uploaded onto ARWeave</p> |
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
| extraTags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Any extraTags you'd like to tag your metadata with. Note that metadata on ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.</p> |

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
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
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

<a name="ARWeaveService"></a>

## ARWeaveService : <code>object</code>
<p>An object that contains functions to interact with Huma-related data stored on ARWeave</p>

**Kind**: global namespace  

* [ARWeaveService](#ARWeaveService) : <code>object</code>
    * [.getBundlrNetworkConfig(chainId)](#ARWeaveService.getBundlrNetworkConfig) ⇒ <code>BundlrConfig</code>
    * [.getBundlrInstance(config, signer)](#ARWeaveService.getBundlrInstance) ⇒
    * [.prefundBundlr(config, signer, amount)](#ARWeaveService.prefundBundlr) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
    * [.storeData(config, signerOrPrivateKey, data, tags, [lazyFund])](#ARWeaveService.storeData) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
    * [.queryForMetadata(chainId, sender, referenceId)](#ARWeaveService.queryForMetadata) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.fetchMetadataFromUrl(url)](#ARWeaveService.fetchMetadataFromUrl) ⇒ <code>Promise.&lt;JSON&gt;</code>
    * [.getURIFromARWeaveId(arweaveId)](#ARWeaveService.getURIFromARWeaveId) ⇒ <code>string</code>
    * [.getBundlrNetworkConfig(chainId)](#ARWeaveService.getBundlrNetworkConfig) ⇒ <code>BundlrConfig</code>
    * [.getBundlrInstance(config, signer)](#ARWeaveService.getBundlrInstance) ⇒
    * [.prefundBundlr(config, signer, amount)](#ARWeaveService.prefundBundlr) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
    * [.storeData(config, signerOrPrivateKey, data, tags, [lazyFund])](#ARWeaveService.storeData) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
    * [.queryForMetadata(chainId, sender, referenceId)](#ARWeaveService.queryForMetadata) ⇒ <code>Promise.&lt;any&gt;</code>
    * [.fetchMetadataFromUrl(url)](#ARWeaveService.fetchMetadataFromUrl) ⇒ <code>Promise.&lt;JSON&gt;</code>
    * [.getURIFromARWeaveId(arweaveId)](#ARWeaveService.getURIFromARWeaveId) ⇒ <code>string</code>
    * [.BundlrConfig](#ARWeaveService.BundlrConfig) : <code>Object</code>
    * [.BundlrConfig](#ARWeaveService.BundlrConfig) : <code>Object</code>

<a name="ARWeaveService.getBundlrNetworkConfig"></a>

### ARWeaveService.getBundlrNetworkConfig(chainId) ⇒ <code>BundlrConfig</code>
<p>Get the configuration for Bundlr network given a chain ID</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>BundlrConfig</code> - <ul>
<li>The configuration for the Bundlr network.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="ARWeaveService.getBundlrInstance"></a>

### ARWeaveService.getBundlrInstance(config, signer) ⇒
<p>Get a Bundlr instance for a specific network</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <p>The Bundlr instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to use Bundlr with.</p> |

<a name="ARWeaveService.prefundBundlr"></a>

### ARWeaveService.prefundBundlr(config, signer, amount) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
<p>Prefund the Bundlr network with the specified amount. Required if not lazy funding.
Important note: The amount is denominated in the base unit of currency for that network.
If you want to upload 5 Matic to the Bundlr node, pass in an amount of 5.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;FundResponse&gt;</code> - <ul>
<li>The fund response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to send funds from.</p> |
| amount | <code>number</code> | <p>The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)</p> |

<a name="ARWeaveService.storeData"></a>

### ARWeaveService.storeData(config, signerOrPrivateKey, data, tags, [lazyFund]) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
<p>Store data on ARWeave using the Bundlr Network.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;UploadResponse&gt;</code> - <p>Promise resolving with the upload response.</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>BundlrConfig</code> |  | <p>Configuration object for the Bundlr instance.</p> |
| signerOrPrivateKey | <code>Web3Provider</code> \| <code>string</code> |  | <p>Wallet object used for interacting with the Bundlr instance. If calling from a browser, this should be a <code>Web3Provider</code> instance. If calling from a Node.js environment, this should be a private key string.</p> |
| data | <code>Record.&lt;string, unknown&gt;</code> |  | <p>The data to store in the Bundlr instance.</p> |
| tags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Array of tag objects with <code>name</code> and <code>value</code> properties.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Optional flag to fund the Bundlr instance lazily. If set to <code>false</code>, the Bundlr node should already be funded or else uploads will fail.</p> |

<a name="ARWeaveService.queryForMetadata"></a>

### ARWeaveService.queryForMetadata(chainId, sender, referenceId) ⇒ <code>Promise.&lt;any&gt;</code>
<p>Helper method to query the Arweave network for receivables metadata previously uploaded.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;any&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |
| sender | <code>string</code> | <p>The sender tag to query.</p> |
| referenceId | <code>string</code> | <p>The referenceId tag to query, whatever was used when uploading the metadata.</p> |

<a name="ARWeaveService.fetchMetadataFromUrl"></a>

### ARWeaveService.fetchMetadataFromUrl(url) ⇒ <code>Promise.&lt;JSON&gt;</code>
<p>Helper method to fetch data from an ARWeave URL.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;JSON&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | <p>The ARWeave metadata URL to query.</p> |

<a name="ARWeaveService.getURIFromARWeaveId"></a>

### ARWeaveService.getURIFromARWeaveId(arweaveId) ⇒ <code>string</code>
<p>Helper method to get an ARWeave URI from an ARWeave ID.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>string</code> - <p>The ARWeave URI.</p>  

| Param | Type | Description |
| --- | --- | --- |
| arweaveId | <code>string</code> | <p>The ARWeave metadata ID.</p> |

<a name="ARWeaveService.getBundlrNetworkConfig"></a>

### ARWeaveService.getBundlrNetworkConfig(chainId) ⇒ <code>BundlrConfig</code>
<p>Get the configuration for Bundlr network given a chain ID</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>BundlrConfig</code> - <ul>
<li>The configuration for the Bundlr network.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |

<a name="ARWeaveService.getBundlrInstance"></a>

### ARWeaveService.getBundlrInstance(config, signer) ⇒
<p>Get a Bundlr instance for a specific network</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <p>The Bundlr instance</p>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to use Bundlr with.</p> |

<a name="ARWeaveService.prefundBundlr"></a>

### ARWeaveService.prefundBundlr(config, signer, amount) ⇒ <code>Promise.&lt;FundResponse&gt;</code>
<p>Prefund the Bundlr network with the specified amount. Required if not lazy funding.
Important note: The amount is denominated in the base unit of currency for that network.
If you want to upload 5 Matic to the Bundlr node, pass in an amount of 5.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;FundResponse&gt;</code> - <ul>
<li>The fund response.</li>
</ul>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>BundlrConfig</code> | <p>The configuration for the Bundlr network.</p> |
| signer | <code>string</code> | <p>The private key of the wallet to send funds from.</p> |
| amount | <code>number</code> | <p>The amount to fund, denoted in whatever currency specified by the config (e.g. MATIC, ETH)</p> |

<a name="ARWeaveService.storeData"></a>

### ARWeaveService.storeData(config, signerOrPrivateKey, data, tags, [lazyFund]) ⇒ <code>Promise.&lt;UploadResponse&gt;</code>
<p>Store data on ARWeave using the Bundlr Network.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;UploadResponse&gt;</code> - <p>Promise resolving with the upload response.</p>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>BundlrConfig</code> |  | <p>Configuration object for the Bundlr instance.</p> |
| signerOrPrivateKey | <code>Web3Provider</code> \| <code>string</code> |  | <p>Wallet object used for interacting with the Bundlr instance. If calling from a browser, this should be a <code>Web3Provider</code> instance. If calling from a Node.js environment, this should be a private key string.</p> |
| data | <code>Record.&lt;string, unknown&gt;</code> |  | <p>The data to store in the Bundlr instance.</p> |
| tags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Array of tag objects with <code>name</code> and <code>value</code> properties.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Optional flag to fund the Bundlr instance lazily. If set to <code>false</code>, the Bundlr node should already be funded or else uploads will fail.</p> |

<a name="ARWeaveService.queryForMetadata"></a>

### ARWeaveService.queryForMetadata(chainId, sender, referenceId) ⇒ <code>Promise.&lt;any&gt;</code>
<p>Helper method to query the Arweave network for receivables metadata previously uploaded.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;any&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| chainId | <code>number</code> | <p>The chain ID.</p> |
| sender | <code>string</code> | <p>The sender tag to query.</p> |
| referenceId | <code>string</code> | <p>The referenceId tag to query, whatever was used when uploading the metadata.</p> |

<a name="ARWeaveService.fetchMetadataFromUrl"></a>

### ARWeaveService.fetchMetadataFromUrl(url) ⇒ <code>Promise.&lt;JSON&gt;</code>
<p>Helper method to fetch data from an ARWeave URL.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>Promise.&lt;JSON&gt;</code> - <p>Promise resolving with the queried data.</p>  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | <p>The ARWeave metadata URL to query.</p> |

<a name="ARWeaveService.getURIFromARWeaveId"></a>

### ARWeaveService.getURIFromARWeaveId(arweaveId) ⇒ <code>string</code>
<p>Helper method to get an ARWeave URI from an ARWeave ID.</p>

**Kind**: static method of [<code>ARWeaveService</code>](#ARWeaveService)  
**Returns**: <code>string</code> - <p>The ARWeave URI.</p>  

| Param | Type | Description |
| --- | --- | --- |
| arweaveId | <code>string</code> | <p>The ARWeave metadata ID.</p> |

<a name="ARWeaveService.BundlrConfig"></a>

### ARWeaveService.BundlrConfig : <code>Object</code>
<p>The configuration for Bundlr network instances</p>

**Kind**: static typedef of [<code>ARWeaveService</code>](#ARWeaveService)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| nodeUrl | <code>string</code> | <p>The Bundlr node URL to use.</p> |
| currency | <code>string</code> | <p>The currency to pay for uploads with. Please see https://docs.bundlr.network/sdk/using-other-currencies for all the supported currencies</p> |
| [providerUrl] | <code>string</code> | <p>The provider URL, required for devnets.</p> |

<a name="ARWeaveService.BundlrConfig"></a>

### ARWeaveService.BundlrConfig : <code>Object</code>
<p>The configuration for Bundlr network instances</p>

**Kind**: static typedef of [<code>ARWeaveService</code>](#ARWeaveService)  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| nodeUrl | <code>string</code> | <p>The Bundlr node URL to use.</p> |
| currency | <code>string</code> | <p>The currency to pay for uploads with. Please see https://docs.bundlr.network/sdk/using-other-currencies for all the supported currencies</p> |
| [providerUrl] | <code>string</code> | <p>The provider URL, required for devnets.</p> |

<a name="ReceivableService"></a>

## ReceivableService : <code>object</code>
<p>An object that contains functions to interact with Huma's receivables.</p>

**Kind**: global namespace  

* [ReceivableService](#ReceivableService) : <code>object</code>
    * [.getTokenIdByURI(signer, arweaveId)](#ReceivableService.getTokenIdByURI) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
    * [.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByReferenceId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByTokenId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts])](#ReceivableService.createReceivable) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
    * [.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund])](#ReceivableService.uploadOrFetchMetadataURI) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts])](#ReceivableService.createReceivableWithMetadata) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType)](#ReceivableService.loadReceivablesOfOwnerWithMetadata) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>
    * [.getTokenIdByURI(signer, arweaveId)](#ReceivableService.getTokenIdByURI) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
    * [.declareReceivablePaymentByReferenceId(signer, referenceId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByReferenceId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.declareReceivablePaymentByTokenId(signer, receivableTokenId, paymentAmount, [gasOpts])](#ReceivableService.declareReceivablePaymentByTokenId) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts])](#ReceivableService.createReceivable) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
    * [.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund])](#ReceivableService.uploadOrFetchMetadataURI) ⇒ <code>Promise.&lt;string&gt;</code>
    * [.createReceivableWithMetadata(signerOrProvider, privateKey, chainId, poolName, poolType, currencyCode, receivableAmount, maturityDate, metadata, referenceId, extraTags, [lazyFund], [gasOpts])](#ReceivableService.createReceivableWithMetadata) ⇒ <code>Promise.&lt;TransactionResponse&gt;</code>
    * [.loadReceivablesOfOwnerWithMetadata(signerOrProvider, owner, poolName, poolType)](#ReceivableService.loadReceivablesOfOwnerWithMetadata) ⇒ <code>Promise.&lt;Array.&lt;RealWorldReceivableInfo&gt;&gt;</code>

<a name="ReceivableService.getTokenIdByURI"></a>

### ReceivableService.getTokenIdByURI(signer, arweaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
<p>Fetches the tokenId of a RealWorldReceivable, or null if it doesn't exist, given a metadata URI</p>

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

### ReceivableService.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts]) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
<p>Creates a new RealWorldReceivable token on the given chain of the signer</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;(TransactionResponse\|null)&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network, or if a token already exists with the same metadata URI.</li>
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

<a name="ReceivableService.uploadOrFetchMetadataURI"></a>

### ReceivableService.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund]) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Uploads metadata onto ARWeave (or fetches the existing metadata with the same reference Id) and returns the ARWeave URL</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <ul>
<li>The ARWeave metadata URI.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> |  | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| privateKey | <code>string</code> \| <code>null</code> |  | <p>Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.</p> |
| chainId | <code>number</code> |  | <p>The chain ID to mint the receivable token on and pay ARWeave funds from.</p> |
| poolName | <code>POOL\_NAME</code> |  | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> |  | <p>The pool type. Used to lookup the pool address to pay to.</p> |
| metadata | <code>Record.&lt;string, any&gt;</code> |  | <p>The metadata in JSON format. This will be uploaded onto ARWeave</p> |
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
| extraTags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Any extraTags you'd like to tag your metadata with. Note that metadata on ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.</p> |

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
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
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

<a name="ReceivableService.getTokenIdByURI"></a>

### ReceivableService.getTokenIdByURI(signer, arweaveId) ⇒ <code>Promise.&lt;(string\|null\|undefined)&gt;</code>
<p>Fetches the tokenId of a RealWorldReceivable, or null if it doesn't exist, given a metadata URI</p>

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

### ReceivableService.createReceivable(signer, poolName, poolType, currencyCode, receivableAmount, maturityDate, uri, [gasOpts]) ⇒ <code>Promise.&lt;(TransactionResponse\|null)&gt;</code>
<p>Creates a new RealWorldReceivable token on the given chain of the signer</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;(TransactionResponse\|null)&gt;</code> - <ul>
<li>A Promise of the transaction response.</li>
</ul>  
**Throws**:

- <code>Error</code> <ul>
<li>Throws an error if the RealWorldReceivable contract is not available on the network, or if a token already exists with the same metadata URI.</li>
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

<a name="ReceivableService.uploadOrFetchMetadataURI"></a>

### ReceivableService.uploadOrFetchMetadataURI(signerOrProvider, privateKey, chainId, poolName, poolType, metadata, referenceId, extraTags, [lazyFund]) ⇒ <code>Promise.&lt;string&gt;</code>
<p>Uploads metadata onto ARWeave (or fetches the existing metadata with the same reference Id) and returns the ARWeave URL</p>

**Kind**: static method of [<code>ReceivableService</code>](#ReceivableService)  
**Returns**: <code>Promise.&lt;string&gt;</code> - <ul>
<li>The ARWeave metadata URI.</li>
</ul>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| signerOrProvider | <code>Web3Provider</code> \| <code>ethers.Signer</code> |  | <p>If calling this function from a browser, this function expects a Web3Provider. If calling this function from a server, this function expects an ethers Signer. Note that privateKey only needs to be included from server calls.</p> |
| privateKey | <code>string</code> \| <code>null</code> |  | <p>Private key of the wallet used to upload metadata to ARWeave. Only required if calling this function from a server.</p> |
| chainId | <code>number</code> |  | <p>The chain ID to mint the receivable token on and pay ARWeave funds from.</p> |
| poolName | <code>POOL\_NAME</code> |  | <p>The pool name. Used to lookup the pool address to pay to.</p> |
| poolType | <code>POOL\_TYPE</code> |  | <p>The pool type. Used to lookup the pool address to pay to.</p> |
| metadata | <code>Record.&lt;string, any&gt;</code> |  | <p>The metadata in JSON format. This will be uploaded onto ARWeave</p> |
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
| extraTags | <code>Array.&lt;{name: string, value: string}&gt;</code> |  | <p>Any extraTags you'd like to tag your metadata with. Note that metadata on ARWeave is indexed by these tags, so make sure to include any tags that you'd like to be able to query by.</p> |
| [lazyFund] | <code>boolean</code> | <code>true</code> | <p>Whether to lazy fund the ARWeave uploads. If true, the ARWeave uploads will be paid for by the metadata uploader immediately before uploading. If false, the ARWeave node must be pre-funded before calling this function.</p> |

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
| referenceId | <code>string</code> |  | <p>An internal identifier value added as a tag on ARWeave, for easily querying the metadata later.</p> |
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
