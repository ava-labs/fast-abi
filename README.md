# fast-abi

Encodes and decodes abi data, fast.

Fork of [0xProject/fast-abi](https://github.com/0xProject/fast-abi/), with a few changes that make it more of a drop-in replacement for the `ethers.js` encoder/decoder:

-   Deserialize int32/uint32 to `number` type instead of `BigNumber`
-   Use `BigNumber` from `ethers.js` for serializing/deserializing

### Usage

```typescript
const RUST_ENCODER = new FastABI(ABI as MethodAbi[]);
const callData = RUST_ENCODER.encodeInput('sampleSellsFromUniswapV2', [...values]);
// 0x.....

// Decode the output of a method call
const output = RUST_ENCODER.decodeOutput('sampleSellsFromUniswapV2', callData);
// {
//   router: '0x6b175474e89094c44da98b954eedeac495271d0f',
//   path: [ '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' ],
//   takerTokenAmounts: [ 1, 2, 3 ]
// }
```
