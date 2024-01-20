import { Deployer } from "../../web3webdeploy/types";
import { Gwei } from "../web3webdeploy/lib/etherUnits";
import { Address, DeployInfo } from "../web3webdeploy/types";

export interface VerifiedContributorStakingDeploymentSettings
  extends Omit<DeployInfo, "contract" | "args"> {
  openToken: Address;
  verifiedContributor: Address;
  tokensPerSecond?: bigint;
  admin: Address;
  ensReverseRegistrar: Address;
}

export async function deployVerifiedContributorStaking(
  deployer: Deployer,
  settings: VerifiedContributorStakingDeploymentSettings
) {
  const openToken = settings.openToken;
  const verifiedContributor = settings.verifiedContributor;
  const tokensPerSecond = Gwei(3858024); // ~10_000 OPEN every 30 days (9999.998208)
  const admin = settings.admin;
  const ensReverseRegistrar = settings.ensReverseRegistrar;

  return await deployer.deploy({
    contract: "VerifiedContributorStaking",
    args: [
      openToken,
      verifiedContributor,
      tokensPerSecond,
      admin,
      ensReverseRegistrar,
    ],
    ...settings,
  });
}
