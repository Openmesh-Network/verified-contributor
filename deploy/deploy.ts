import { Address, Deployer } from "../web3webdeploy/types";
import {
  OpenTokenDeployment,
  deploy as openTokenDeploy,
} from "../lib/open-token/deploy/deploy";
import {
  deployVerifiedContributor,
  VerifiedContributorDeploymentSettings as VerifiedContributorDeploymentSettingsInternal,
} from "./verified-contributor/VerifiedContributor";
import {
  deployVerifiedContributorStaking,
  VerifiedContributorStakingDeploymentSettings,
} from "./verified-contributor/VerifiedContributorStaking";
import { Gwei } from "../web3webdeploy/lib/etherUnits";

export interface VerifiedContributorDeploymentSettings {
  openTokenDeployment: OpenTokenDeployment;
  verifiedContributorDeploymentSettings: VerifiedContributorDeploymentSettingsInternal;
  verifiedContributorStakingDeploymentSettings: Omit<
    VerifiedContributorStakingDeploymentSettings,
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
    settings?.verifiedContributorDeploymentSettings ?? {}
  );

  const verifiedContributorStaking = await deployVerifiedContributorStaking(
    deployer,
    {
      openToken: openTokenDeployment.openToken,
      verifiedContributor: verifiedContributor,
      ...(settings?.verifiedContributorStakingDeploymentSettings ?? {
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
