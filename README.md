## Verified Contributor

The Openmesh Verified Contributor (OVC) ERC721 token contract.  
More information about them can be found on the [OpenR&D docs](https://open-mesh.gitbook.io/l3a-dao-documentation/about/verified-contributors).  

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Deploy

```shell
make deploy
```

## Local chain

```shell
anvil
make local-fund ADDRESS="YOURADDRESSHERE"
```

### Analyze

```shell
make slither
make mythril TARGET=Counter.sol
```

### Help

```shell
forge --help
anvil --help
cast --help
```
