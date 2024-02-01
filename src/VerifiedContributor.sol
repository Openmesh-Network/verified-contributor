// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {
    ERC721Enumerable,
    ERC721
} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {AccessControl} from "../lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import {ClaimReverseENS} from "../lib/ens-reverse-registrar/src/ClaimReverseENS.sol";

import {IERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {IVerifiedContributor} from "./IVerifiedContributor.sol";

contract VerifiedContributor is ERC721Enumerable, AccessControl, ClaimReverseENS, IVerifiedContributor {
    bytes32 public constant MINT_ROLE = keccak256("MINT");
    bytes32 public constant BURN_ROLE = keccak256("BURN");
    string public metadataUri;

    error NotTransferable();

    constructor(
        string memory name_,
        string memory symbol_,
        string memory _metadataUri,
        address _admin,
        address _reverseRegistrar
    ) ERC721(name_, symbol_) ClaimReverseENS(_reverseRegistrar, _admin) {
        metadataUri = _metadataUri;
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    /// @inheritdoc ERC721Enumerable
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return ERC721Enumerable.supportsInterface(_interfaceId) || AccessControl.supportsInterface(_interfaceId);
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

    function tokenURI(uint256) public view override returns (string memory) {
        // Single image
        return metadataUri;
    }

    /// @inheritdoc IVerifiedContributor
    function updateMetadata(string calldata _metadataUri) external onlyRole(DEFAULT_ADMIN_ROLE) {
        metadataUri = _metadataUri;
    }
}
