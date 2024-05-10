import { Address, Deployer } from "../web3webdeploy/types";
import {
  DeployVerifiedContributorSettings,
  deployVerifiedContributor,
} from "./internal/VerifiedContributor";

export interface VerifiedContributorDeploymentSettings {
  verifiedContributorSettings: DeployVerifiedContributorSettings;
  forceRedeploy?: boolean;
}

export interface VerifiedContributorDeployment {
  verifiedContributor: Address;
}

export async function deploy(
  deployer: Deployer,
  settings?: VerifiedContributorDeploymentSettings
): Promise<VerifiedContributorDeployment> {
  if (settings?.forceRedeploy !== undefined && !settings.forceRedeploy) {
    const existingDeployment = await deployer.loadDeployment({
      deploymentName: "latest.json",
    });
    if (existingDeployment !== undefined) {
      return existingDeployment;
    }
  }

  const verifiedContributor: VerifiedContributorDeployment =
    await deployVerifiedContributor(
      deployer,
      settings?.verifiedContributorSettings ?? {}
    );

  const deployment = {
    verifiedContributor: verifiedContributor,
  };
  await deployer.saveDeployment({
    deploymentName: "latest.json",
    deployment: deployment,
  });
  return deployment;
}
