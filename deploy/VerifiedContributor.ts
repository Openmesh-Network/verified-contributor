import { Deployer } from "../../web3webdeploy/types";
import { Address, DeployInfo } from "../web3webdeploy/types";

export interface VerifiedContributorDeploymentSettings
  extends Omit<DeployInfo, "contract" | "args"> {
  tokenName?: string;
  tokenTicker?: string;
  tokenUri?: string;
  admin?: Address;
}

export async function deployVerifiedContributor(
  deployer: Deployer,
  settings: VerifiedContributorDeploymentSettings
) {
  const tokenName = settings.tokenName ?? "Openmesh Verified Contributor";
  const tokenTicker = settings.tokenTicker ?? "OVC";
  const tokenUri =
    settings.tokenUri ?? "https://erc721.openmesh.network/metadata/ovc.json";
  const admin = settings.admin ?? "0x2309762aAcA0a8F689463a42c0A6A84BE3A7ea51";

  return await deployer.deploy({
    contract: "VerifiedContributor",
    args: [tokenName, tokenTicker, tokenUri, admin],
    ...settings,
  });
}
