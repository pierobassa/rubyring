# DApp Documentation

## Requirements:

- Foundryup (https://book.getfoundry.sh/getting-started/installation)
- `.env.local` file correctly set with all required values from `.env.example`

## Installation

```
yarn install
```

## Running the DApp

```
yarn run dev
```

# Foundry

## Test contracts

```bash
forge test # Displays a summary of passing / failing tests
```

The default behavior for forge test is to only display a summary of passing and failing tests. You can control this behavior by increasing the verbosity (using the -v flag). Each level of verbosity adds more information:

- Level 2 (-vv): Logs emitted during tests are also displayed. That includes assertion errors from tests, showing information such as expected vs actual.
- Level 3 (-vvv): Stack traces for failing tests are also displayed.
- Level 4 (-vvvv): Stack traces for all tests are displayed, and setup traces for failing tests are displayed.
- Level 5 (-vvvvv): Stack traces and setup traces are always displayed.

## Deploy contracts

First set your environment variables by creating `.env` file in `./forge` directory

```bash
cd forge
source .env # source environment variables
```

### Deploy unverified contract

```bash
forge create --rpc-url $RPC_URL \
--private-key $PRIVATE_KEY \
src/RubyRingV1.sol:RubyRingV1
```

Get an `RPC_URL` from a Node Provider, e.g [Alchemy](https://dashboard.alchemy.com/)

### Deploy verified contract

```bash
forge create --rpc-url $RPC_URL \
    --private-key $PRIVATE_KEY \
    --etherscan-api-key $ETHERSCAN_API_KEY \
    --verify \
    src/RubyRingV1.sol:RubyRingV1
```

### Interact with deployed contract using [CAST](https://book.getfoundry.sh/cast/#overview-of-cast)

Updated the `DEPLOYED_CONTRACT_ADDRESS` env variable with the contract address deployed previously

## Update fee destination addresses

```bash
cast send $DEPLOYED_CONTRACT_ADDRESS --private-key $PRIVATE_KEY \
        "setFeeDestination(address)" <ADDRESS_FOR_FEE_DESTINATION> \
        --rpc-url $RPC_URL
```

## Update protocol fee percent

```bash
cast send $DEPLOYED_CONTRACT_ADDRESS --private-key $PRIVATE_KEY \
          --rpc-url $RPC_URL
         "setProtocolFeePercent(uint256)" <FEE_PERCENT_IN_WEI>  \
```

e.g.,

```bash
cast send $DEPLOYED_CONTRACT_ADDRESS --private-key $PRIVATE_KEY  --rpc-url $RPC_URL "setProtocolFeePercent(uint256)" 50000000000000000 # 0.05%
```

## Update subject fee percent

```bash
cast send $DEPLOYED_CONTRACT_ADDRESS --private-key $PRIVATE_KEY \
         "setSubjectFeePercent(uint256)" <FEE_PERCENT_IN_WEI> \
          --rpc-url $RPC_URL
```

e.g.,

```bash
cast send $DEPLOYED_CONTRACT_ADDRESS --private-key $PRIVATE_KEY  --rpc-url $RPC_URL "setSubjectFeePercent(uint256)" 50000000000000000 # 0.05%
```

## Contract calls

#### Example: getBuyPrice()

```bash
cast call $DEPLOYED_CONTRACT_ADDRESS "getBuyPrice(address, uint256)" \
        <GEM_SUBJECT_ADDRESS> <AMOUNT_TO_BUY> \
        --rpc-url $RPC_URL
```

e.g.,

```bash
cast call $DEPLOYED_CONTRACT_ADDRESS "getBuyPrice(address, uint256)" 0xFd7f2FD12c04De6959FBA1cF53bDfC1A608E3377 2 --rpc-url $RPC_URL
```

#### Example: gemsBalance()

```bash
cast call $DEPLOYED_CONTRACT_ADDRESS "gemsBalance(address, address)" \
        <GEM_SUBJECT_ADDRESS> <USER_ADDRESS> \
        --rpc-url $RPC_URL
```

e.g.,

```bash
cast call $DEPLOYED_CONTRACT_ADDRESS "gemsBalance(address, address)" 0x05789ff70a29041fbe618ed0d0674e2b3998df1f 0x05789ff70a29041fbe618ed0d0674e2b3998df1f --rpc-url $RPC_URL
```

## Backend Documentation

### Running via docker

`docker compose up -d`

### Running on your machine

#### Requirements

- MongoDB (https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/)
- Python 3
- Pip 3

#### Installation

```python
cd backend
source venv/bin/activate
source .env

pip install -r requirements.txt
```

#### Run the app

`sh ./scripts/run.sh`

### Cool to have

- MongoDB Compass GUI (Handy GUI for the mongodb database)

### API Docs OpenAPI

After running the backend head to `http://127.0.0.1:8000/docs`

### Tests

`python -m pytest test`
