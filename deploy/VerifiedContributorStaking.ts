import { Deployer } from "../../web3webdeploy/types";
import { Gwei } from "../web3webdeploy/lib/etherUnits";
import { Address, DeployInfo } from "../web3webdeploy/types";

export interface VerifiedContributorStakingDeploymentSettings
  extends Omit<DeployInfo, "contract" | "args"> {
  openToken: Address;
  verifiedContributor: Address;
  tokensPerSecond?: bigint;
  admin?: Address;
}

export async function deployVerifiedContributorStaking(
  deployer: Deployer,
  settings: VerifiedContributorStakingDeploymentSettings
) {
  const openToken = settings.openToken;
  const verifiedContributor = settings.verifiedContributor;
  const tokensPerSecond = settings.tokensPerSecond ?? Gwei(3858024); // ~10_000 OPEN every 30 days (9999.998208)
  const admin = settings.admin ?? "0x2309762aAcA0a8F689463a42c0A6A84BE3A7ea51";

  return await deployer.deploy({
    contract: "VerifiedContributorStaking",
    args: [openToken, verifiedContributor, tokensPerSecond, admin],
    ...settings,
  });
}
