import { Deployer } from "../../web3webdeploy/types";
import { Address, DeployInfo } from "../web3webdeploy/types";

export interface VerifiedContributorDeploymentSettings
  extends Omit<DeployInfo, "contract" | "args"> {
  tokenName?: string;
  tokenTicker?: string;
  tokenUri?: string;
  admin: Address;
  ensReverseRegistrar: Address;
}

export async function deployVerifiedContributor(
  deployer: Deployer,
  settings: VerifiedContributorDeploymentSettings
) {
  const tokenName = settings.tokenName ?? "Openmesh Verified Contributor";
  const tokenTicker = settings.tokenTicker ?? "OVC";
  const tokenUri =
    settings.tokenUri ?? "https://erc721.openmesh.network/metadata/ovc.json";
  const admin = settings.admin;
  const ensReverseRegistrar = settings.ensReverseRegistrar;

  return await deployer.deploy({
    contract: "VerifiedContributor",
    args: [tokenName, tokenTicker, tokenUri, admin, ensReverseRegistrar],
    ...settings,
  });
}
