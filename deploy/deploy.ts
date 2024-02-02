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

export interface VerifiedContributorDeploymentSettings {
  openTokenDeployment: OpenTokenDeployment;
  verifiedContributorDeploymentSettings: VerifiedContributorDeploymentSettingsInternal;
  verifiedContributorStakingDeploymentSettings: Omit<
    VerifiedContributorStakingDeploymentSettings,
    "openToken" | "verifiedContributor"
  >;
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
      ...(settings?.verifiedContributorStakingDeploymentSettings ?? {}),
      openToken: openTokenDeployment.openToken,
      verifiedContributor: verifiedContributor,
    }
  );

  return {
    verifiedContributor: verifiedContributor,
    verifiedContributorStaking: verifiedContributorStaking,
  };
}
