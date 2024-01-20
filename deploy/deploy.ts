import { Address, Deployer } from "../web3webdeploy/types";
import { OpenTokenDeployment } from "../lib/open-token/deploy/deploy";
import {
  deployVerifiedContributor,
  VerifiedContributorDeploymentSettings as VerifiedContributorDeploymentSettingsInternal,
} from "./VerifiedContributor";
import { zeroAddress } from "viem";
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
  const verifiedContributor = await deployVerifiedContributor(
    deployer,
    settings?.verifiedContributorDeploymentSettings ?? {
      admin: zeroAddress,
      ensReverseRegistrar: zeroAddress,
    }
  );

  const verifiedContributorStaking = await deployVerifiedContributorStaking(
    deployer,
    {
      ...(settings?.verifiedContributorStakingDeploymentSettings ?? {
        admin: zeroAddress,
        ensReverseRegistrar: zeroAddress,
      }),
      openToken: settings?.openTokenDeployment.openToken ?? zeroAddress,
      verifiedContributor: verifiedContributor,
    }
  );

  return {
    verifiedContributor: verifiedContributor,
    verifiedContributorStaking: verifiedContributorStaking,
  };
}
