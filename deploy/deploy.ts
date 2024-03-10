import { Address, Deployer } from "../web3webdeploy/types";
import {
  OpenTokenDeployment,
  deploy as openTokenDeploy,
} from "../lib/open-token/deploy/deploy";
import {
  DeployVerifiedContributorSettings,
  deployVerifiedContributor,
} from "./verified-contributor/VerifiedContributor";
import {
  DeployVerifiedContributorStakingSettings,
  deployVerifiedContributorStaking,
} from "./verified-contributor/VerifiedContributorStaking";
import { Gwei } from "../web3webdeploy/lib/etherUnits";

export interface VerifiedContributorDeploymentSettings {
  openTokenDeployment: OpenTokenDeployment;
  verifiedContributorSettings: DeployVerifiedContributorSettings;
  verifiedContributorStakingSettings: Omit<
    DeployVerifiedContributorStakingSettings,
    "openToken" | "verifiedContributor"
  >;
  forceRedeploy?: boolean;
}

export interface VerifiedContributorDeployment {
  verifiedContributor: Address;
  verifiedContributorStaking: Address;
}

export async function deploy(
  deployer: Deployer,
  settings?: VerifiedContributorDeploymentSettings
): Promise<VerifiedContributorDeployment> {
  if (settings?.forceRedeploy !== undefined && !settings.forceRedeploy) {
    return await deployer.loadDeployment({ deploymentName: "latest.json" });
  }

  deployer.startContext("lib/open-token");
  const openTokenDeployment =
    settings?.openTokenDeployment ?? (await openTokenDeploy(deployer));
  deployer.finishContext();

  const verifiedContributor = await deployVerifiedContributor(
    deployer,
    settings?.verifiedContributorSettings ?? {}
  );

  const verifiedContributorStaking = await deployVerifiedContributorStaking(
    deployer,
    {
      openToken: openTokenDeployment.openToken,
      verifiedContributor: verifiedContributor,
      ...(settings?.verifiedContributorStakingSettings ?? {
        tokensPerSecond: Gwei(3858024), // ~10_000 OPEN every 30 days (9999.998208)
      }),
    }
  );

  const deployment = {
    verifiedContributor: verifiedContributor,
    verifiedContributorStaking: verifiedContributorStaking,
  };
  await deployer.saveDeployment({
    deploymentName: "latest.json",
    deployment: deployment,
  });
  return deployment;
}
