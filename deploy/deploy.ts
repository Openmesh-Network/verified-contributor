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
import { deploy as openmeshAdminDeploy } from "../lib/openmesh-admin/deploy/deploy";
import { deploy as ensReverseRegistrarDeploy } from "../lib/ens-reverse-registrar/deploy/deploy";

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
  // Cache to only invoke the deployment once (but not invoked if no one uses it)
  let _defaultSettings:
    | { admin: Address; ensReverseRegistrar: Address }
    | undefined;
  const defaultSettings = async () => {
    if (!_defaultSettings) {
      deployer.startContext("lib/openmesh-admin");
      const admin = (await openmeshAdminDeploy(deployer)).admin;
      deployer.finishContext();
      deployer.startContext("lib/ens-reverse-registrar");
      const ensReverseRegistrar = (await ensReverseRegistrarDeploy(deployer))
        .reverseRegistrar;
      deployer.finishContext();
      _defaultSettings = {
        admin: admin,
        ensReverseRegistrar: ensReverseRegistrar,
      };
    }

    return _defaultSettings;
  };

  deployer.startContext("lib/open-token");
  const openTokenDeployment =
    settings?.openTokenDeployment ??
    (await openTokenDeploy(deployer, await defaultSettings()));
  deployer.finishContext();

  const verifiedContributor = await deployVerifiedContributor(
    deployer,
    settings?.verifiedContributorDeploymentSettings ?? (await defaultSettings())
  );

  const verifiedContributorStaking = await deployVerifiedContributorStaking(
    deployer,
    {
      ...(settings?.verifiedContributorStakingDeploymentSettings ??
        (await defaultSettings())),
      openToken: openTokenDeployment.openToken,
      verifiedContributor: verifiedContributor,
    }
  );

  return {
    verifiedContributor: verifiedContributor,
    verifiedContributorStaking: verifiedContributorStaking,
  };
}
