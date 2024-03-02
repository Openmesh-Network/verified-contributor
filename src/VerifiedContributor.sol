// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {
    ERC721Enumerable,
    ERC721
} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {ERC721Votes} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {EIP712} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {AccessControl} from "../lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import {OpenmeshENSReverseClaimable} from "../lib/openmesh-admin/src/OpenmeshENSReverseClaimable.sol";

import {
    IERC721Metadata,
    IERC721
} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {IVerifiedContributor} from "./IVerifiedContributor.sol";

contract VerifiedContributor is
    ERC721,
    ERC721Enumerable,
    EIP712,
    ERC721Votes,
    AccessControl,
    OpenmeshENSReverseClaimable,
    IVerifiedContributor
{
    bytes32 public constant MINT_ROLE = keccak256("MINT");
    bytes32 public constant BURN_ROLE = keccak256("BURN");
    string private metadataUri = "https://erc721.openmesh.network/metadata/ovc/";

    error NotTransferable();

    constructor() ERC721("Openmesh Verified Contributor", "OVC") EIP712("Openmesh Verified Contributor", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, OPENMESH_ADMIN);
    }

    /// @inheritdoc ERC721
    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Votes)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    /// @inheritdoc ERC721
    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable, ERC721Votes)
    {
        super._increaseBalance(account, value);
    }

    /// @inheritdoc ERC721
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(_interfaceId);
    }

    /// @inheritdoc IVerifiedContributor
    function mint(address to, uint256 tokenId) external onlyRole(MINT_ROLE) {
        _mint(to, tokenId);
    }

    /// @inheritdoc IVerifiedContributor
    function burn(uint256 tokenId) external onlyRole(BURN_ROLE) {
        _burn(tokenId);
    }

    /// @inheritdoc IERC721
    function transferFrom(address from, address to, uint256 tokenId) public override(ERC721, IERC721) {
        if (from != address(0)) {
            // Not a mint, token is non-transferable
            revert NotTransferable();
        }

        super.transferFrom(from, to, tokenId);
    }

    /// @inheritdoc ERC721
    function _baseURI() internal view override returns (string memory) {
        return metadataUri;
    }

    /// @inheritdoc IVerifiedContributor
    function updateMetadata(string calldata _metadataUri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        metadataUri = _metadataUri;
    }
}
