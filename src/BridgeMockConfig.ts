import type { BridgeButtonVisibility, BridgeTheme, OverscrollEffects, SystemBarAppearance, SystemNightMode } from "@bridgelauncher/api";

import { windowInsets } from "./utils";

export function createDefaultBridgeMockConfig()
{
    return {
        // system
        apiLevel: 34,
        bridgeVersionCode: 2,
        bridgeVersionName: '0.0.2alpha',
        logRaisedBridgeEvents: true,

        // fetch
        projectUrl: '/',
        appsUrl: '/mock/apps.json',
        makeGetDefaultIconUrl: (packageName: string) => `/mock/icons/default/${packageName}.png`,

        // wallpaper
        logWallpaperEvents: true,
        logWallpaperScrolling: false,

        // Bridge button
        initialBridgeButtonVisibility: <BridgeButtonVisibility>'hidden',

        // draw system wallpaper behind web view
        initialDrawSystemWallpaperBehindWebViewEnabled: true,

        // overscroll effects
        initialOverscrollEffects: <OverscrollEffects>'none',

        // system night mode
        canRequestSystemNightMode: true,
        initialSystemNightMode: <SystemNightMode>'auto',

        // Bridge theme
        initialBridgeTheme: <BridgeTheme>'system',

        // screen locking 
        initialCanLockScreen: false,

        // misc actions

        // toast

        // window insets & cutouts
        initialStatusBarAppearance: <SystemBarAppearance>'hide',
        initialNavigationBarAppearance: <SystemBarAppearance>'hide',
        statusBarHeight: 24,
        navigationBarHeight: 48,

        captionBarWindowInsets: windowInsets(0, 0, 0, 0),
        captionBarIgnoringVisibilityWindowInsets: windowInsets(0, 0, 0, 0),

        imeWindowInsets: windowInsets(0, 0, 0, 0),
        imeAnimationSourceWindowInsets: windowInsets(0, 0, 0, 0),
        imeAnimationTargetWindowInsets: windowInsets(0, 0, 0, 0),

        tappableElementWindowInsets: windowInsets(0, 0, 0, 0),
        tappableElementIgnoringVisibilityWindowInsets: windowInsets(0, 0, 0, 0),

        systemGesturesWindowInsets: windowInsets(0, 0, 0, 0),
        mandatorySystemGesturesWindowInsets: windowInsets(0, 0, 0, 0),

        displayCutoutWindowInsets: windowInsets(0, 0, 0, 0),
        waterfallWindowInsets: windowInsets(0, 0, 0, 0),

        displayCutoutPath: <string | null>null,
        displayShapePath: <string | null>null,
    };
}

export type BridgeMockConfig = ReturnType<typeof createDefaultBridgeMockConfig>;