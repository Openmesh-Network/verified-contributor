// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ERC721Votes, ERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/ERC721Votes.sol";
import {EIP712} from "../lib/openzeppelin-contracts/contracts/utils/cryptography/EIP712.sol";
import {AccessControl} from "../lib/openzeppelin-contracts/contracts/access/AccessControl.sol";
import {OpenmeshENSReverseClaimable} from "../lib/openmesh-admin/src/OpenmeshENSReverseClaimable.sol";

import {
    IERC721Metadata,
    IERC721
} from "../lib/openzeppelin-contracts/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import {IVotes} from "../lib/openzeppelin-contracts/contracts/governance/utils/IVotes.sol";
import {IERC5267} from "../lib/openzeppelin-contracts/contracts/interfaces/IERC5267.sol";
import {IERC6372} from "../lib/openzeppelin-contracts/contracts/interfaces/IERC6372.sol";
import {IVerifiedContributor} from "./IVerifiedContributor.sol";

contract VerifiedContributor is
    EIP712,
    ERC721Votes,
    AccessControl,
    OpenmeshENSReverseClaimable,
    IVerifiedContributor
{
    bytes32 public constant MINT_ROLE = keccak256("MINT");
    bytes32 public constant BURN_ROLE = keccak256("BURN");
    bytes32 public constant METADATA_ROLE = keccak256("METADATA");
    string private metadataUri = "https://erc721.openmesh.network/metadata/ovc/";

    error NotTransferable();

    constructor() ERC721("Openmesh Verified Contributor", "OVC") EIP712("Openmesh Verified Contributor", "1") {
        _grantRole(DEFAULT_ADMIN_ROLE, OPENMESH_ADMIN);
    }

    /// @inheritdoc ERC721
    function supportsInterface(bytes4 _interfaceId)
        public
        view
        virtual
        override(ERC721, AccessControl)
        returns (bool)
    {
        return _interfaceId == type(IVerifiedContributor).interfaceId || _interfaceId == type(IVotes).interfaceId
            || _interfaceId == type(IERC5267).interfaceId || _interfaceId == type(IERC6372).interfaceId
            || ERC721.supportsInterface(_interfaceId) || AccessControl.supportsInterface(_interfaceId);
    }

    /// @inheritdoc IVerifiedContributor
    function mint(address to, uint256 tokenId) external onlyRole(MINT_ROLE) {
        _mint(to, tokenId);
    }

    /// @inheritdoc IVerifiedContributor
    function burn(uint256 tokenId) external {
        if (msg.sender != _ownerOf((tokenId))) {
            // If not owned by you, need BURN role.
            _checkRole(BURN_ROLE);
        }

        _burn(tokenId);
    }

    /// @inheritdoc IERC721
    function transferFrom(address, address, uint256) public pure override {
        revert NotTransferable();
    }

    /// @inheritdoc ERC721
    function _baseURI() internal view override returns (string memory) {
        return metadataUri;
    }

    /// @inheritdoc IVerifiedContributor
    function updateMetadata(string calldata _metadataUri) external onlyRole(METADATA_ROLE) {
        metadataUri = _metadataUri;
    }
}
