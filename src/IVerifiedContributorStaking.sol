// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC721} from "../lib/openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import {Ownable} from "../lib/openzeppelin-contracts/contracts/access/Ownable.sol";

import {IERC20MintBurnable} from "../lib/open-token/src/IERC20MintBurnable.sol";

interface IVerifiedContributorStaking {
    error NotYourNFT();
    error NFTAlreadyStaked();
    error NFTNotStaked();
    error StakingEndMustBeInTheFuture();
    error Overflow();

    event NFTStaked(uint256 indexed tokenId);
    event TokensClaimed(uint256 indexed tokenId, uint256 tokens);
    event NFTUnstaked(uint256 indexed tokenId);

    /// @notice Stakes your NFT.
    /// @param _tokenId The id of the NFT to stake.
    function stake(uint256 _tokenId) external;

    /// @notice Unstakes your NFT.
    /// @param _tokenId The id of the NFT to unstake.
    function unstake(uint256 _tokenId) external;

    /// @notice Checks how much tokens are claimable.
    /// @param _tokenId The id of the NFT to check claimable tokens.
    function claimable(uint256 _tokenId) external view returns (uint256 claimableTokens);

    /// @notice Claims all claimable tokens.
    /// @param _tokenId The id of the NFT to claim tokens for.
    /// @dev Can be called by any wallet, but tokens will be claimed to NFT owner.
    function claim(uint256 _tokenId) external;
}
