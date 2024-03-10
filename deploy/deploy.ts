import { Address, Deployer } from "../web3webdeploy/types";
import {
  OpenTokenDeployment,
  deploy as openTokenDeploy,
} from "../lib/open-token/deploy/deploy";
import {
  deployVerifiedContributor,
  VerifiedContributorDeploymentSettings as VerifiedContributorDeploymentSettingsInternal,
} from "./VerifiedContributor";
import {
  deployVerifiedContributorStaking,
  VerifiedContributorStakingDeploymentSettings,
} from "./VerifiedContributorStaking";
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
      ...(settings?.verifiedContributorStakingDeploymentSettings ?? {
        tokensPerSecond: Gwei(3858024), // ~10_000 OPEN every 30 days (9999.998208)
      }),
      openToken: openTokenDeployment.openToken,
      verifiedContributor: verifiedContributor,
    }
  );

  return {
    verifiedContributor: verifiedContributor,
    verifiedContributorStaking: verifiedContributorStaking,
  };
  await deployer.saveDeployment({
    deploymentName: "latest.json",
    deployment: deployment,
  });
  return deployment;
}
