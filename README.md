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

### Publishing

Publishing this repo is a little difficult. On top of cutting a normal github
release, it is important we package pre-built binaries for different
os/architectures. This allows the binary to be downloaded directly rather than
rebuilt which saves minutes when building a fresh docker image.

To publish this package:
1. Push a new commit to main with an updated version in `package.json`.
2. Publish the npm package with the new version using `yarn publish`.
3. Cut a github release with a tag equal to the version (e.g. `0.0.9`) and a
   title starting with `v` (e.g. `v0.0.9`). This will create the release that
   the binaries will be associated with.

   Run and push the following command which should create the binaries for the
   `linux`/`x64` os/arch pairing:

   ```sh
   git commit -m "[publish binary]" --allow-empty
   git push
   ```

   This will kick off a ci job to create and publish the linux binary.
4. At ava labs, most engineers use the `darwin`/`arm64` os and architecture
   pairing (M1 Macs). Unfortunately github doesn't host a runner with this
   pairing so it needs to be created manually by someone from a laptop with
   this set up.

   Run the following from such a machine:
   ```sh
   export NODE_PRE_GYP_GITHUB_TOKEN=$NODE_PRE_GYP_GITHUB_TOKEN
   yarn build && yarn node-pre-gyp package --target_arch=arm64 --target_platform=darwin --target=16.0.0 && yarn node-pre-gyp-github publish
   ```

   This will build and publish the `darwin`/`arm64` binary.

   Note that this will work for other pairings too, but we have noticed
   problems doing this with an architecture mismatch from the running machine.