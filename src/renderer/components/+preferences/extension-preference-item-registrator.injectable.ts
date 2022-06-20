/**
 * Copyright (c) OpenLens Authors. All rights reserved.
 * Licensed under MIT License. See LICENSE in root directory for more information.
 */
import { getInjectable } from "@ogre-tools/injectable";
import { filter, map } from "lodash/fp";
import { extensionRegistratorInjectionToken } from "../../../extensions/extension-loader/extension-registrator-injection-token";
import type { LensRendererExtension } from "../../../extensions/lens-renderer-extension";
import { pipeline } from "@ogre-tools/fp";
import { extensionPreferenceItemInjectionToken } from "./extension-preference-items-injection-token";

const extensionPreferenceItemRegistratorInjectable = getInjectable({
  id: "extension-preference-item-registrator",

  instantiate:
    () =>
      (ext) => {
        const extension = ext as LensRendererExtension;

        return pipeline(
          extension.appPreferences,

          filter(
            (registration) => !registration.showInPreferencesTab,
          ),

          map((registration) => {
            const id = `extension-preferences-item-${registration.id}-for-extension-${extension.sanitizedExtensionId}`;

            return getInjectable({
              id,
              injectionToken: extensionPreferenceItemInjectionToken,

              instantiate: () => ({
                id: registration.id || id,
                title: registration.title,

                components: {
                  Hint: registration.components.Hint,
                  Input: registration.components.Input,
                },
              }),
            });
          }),
        );
      },

  injectionToken: extensionRegistratorInjectionToken,
});

export default extensionPreferenceItemRegistratorInjectable;
