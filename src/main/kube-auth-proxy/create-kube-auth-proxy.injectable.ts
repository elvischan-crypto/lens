/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import type { KubeAuthProxyDependencies } from "./kube-auth-proxy";
import { KubeAuthProxy } from "./kube-auth-proxy";
import type { Cluster } from "../../common/cluster/cluster";
import path from "path";
import selfsigned from "selfsigned";
import { getBinaryName } from "../../common/vars";
import spawnInjectable from "../child-process/spawn.injectable";
import { getKubeAuthProxyCertificate } from "./get-kube-auth-proxy-certificate";
import baseBundeledBinariesDirectoryInjectable from "../../common/vars/base-bundled-binaries-dir.injectable";

export type CreateKubeAuthProxy = (cluster: Cluster, environmentVariables: NodeJS.ProcessEnv) => KubeAuthProxy;

const createKubeAuthProxyInjectable = getInjectable({
  id: "create-kube-auth-proxy",

  instantiate: (di): CreateKubeAuthProxy => {
    const binaryName = getBinaryName("lens-k8s-proxy");

    return (cluster: Cluster, environmentVariables: NodeJS.ProcessEnv) => {
      const clusterUrl = new URL(cluster.apiUrl);
      const dependencies: KubeAuthProxyDependencies = {
        proxyBinPath: path.join(di.inject(baseBundeledBinariesDirectoryInjectable), binaryName),
        proxyCert: getKubeAuthProxyCertificate(clusterUrl.hostname, selfsigned.generate),
        spawn: di.inject(spawnInjectable),
      };

      return new KubeAuthProxy(dependencies, cluster, environmentVariables);
    };
  },
});

export default createKubeAuthProxyInjectable;
