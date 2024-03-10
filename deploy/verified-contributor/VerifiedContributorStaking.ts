import { Deployer, Address, DeployInfo } from "../../web3webdeploy/types";

export interface DeployVerifiedContributorStakingSettings
  extends Omit<DeployInfo, "contract" | "args"> {
  openToken: Address;
  verifiedContributor: Address;
  tokensPerSecond: bigint;
}

export async function deployVerifiedContributorStaking(
  deployer: Deployer,
  settings: DeployVerifiedContributorStakingSettings
) {
  const openToken = settings.openToken;
  const verifiedContributor = settings.verifiedContributor;
  const tokensPerSecond = settings.tokensPerSecond;

  return await deployer.deploy({
    id: "VerifiedContributorStaking",
    contract: "VerifiedContributorStaking",
    args: [openToken, verifiedContributor, tokensPerSecond],
    ...settings,
  });
}
