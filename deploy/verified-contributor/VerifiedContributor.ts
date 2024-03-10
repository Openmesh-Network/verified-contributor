import { Deployer, DeployInfo } from "../../web3webdeploy/types";

export interface DeployVerifiedContributorSettings
  extends Omit<DeployInfo, "contract" | "args"> {}

export async function deployVerifiedContributor(
  deployer: Deployer,
  settings: DeployVerifiedContributorSettings
) {
  return await deployer
    .deploy({
      id: "VerifiedContributor",
      contract: "VerifiedContributor",
      ...settings,
    })
    .then((deployment) => deployment.address);
}
