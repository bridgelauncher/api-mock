import type { BridgeButtonVisibility, BridgeEventListenerArgs, BridgeInstalledAppInfo, BridgeTheme, JSToBridgeAPI, SystemBarAppearance, SystemNightMode, SystemNightModeOrError, WindowInsets, WindowInsetsJson, BridgeGetAppsResponse, OverscrollEffects } from "@bridgelauncher/api";
import { createDefaultBridgeMockConfig as createDefaultBridgeMockConfig, type BridgeMockConfig } from "./BridgeMockConfig";
import { windowInsets } from "./utils";

/**
 * A class implementing the same interface as the Bridge Launcher API for development purposes.
 * 
 * @example
 * // default mock implementation, use before any code that uses the API
 * if (!window.Bridge) window.Bridge = new BridgeMock();
 * 
 * @example 
 * // create a custom config
 * if (!window.Bridge) window.Bridge = new BridgeMock({
 *      ...createDefaultBridgeMockConfig(),
 *      initialBridgeTheme: 'light',
 * });
 * 
 * @example
 * // extend the class to override a particular implementation
 * export class CustomBridgeMock extends BridgeMock
 * {
 *      override showToast(message: string, long: boolean = false)
 *      {
 *          console.log(`[BridgeMock] ${long ? 'long' : 'short'} toast: ${message}`)
 *      }
 * }
 * 
 * @example
 * // change configuration at runtime
 * if (window.Bridge instanceof BridgeMock)
 *      window.Bridge.config.logWallpaperEvents = true
 */
export class BridgeMock implements JSToBridgeAPI
{
    public config: BridgeMockConfig;

    protected _prefix = '[BridgeMock]';

    public lastErrorMessage: string | null = null;

    public wallpaperOffsetStepsX: number = 1;
    public wallpaperOffsetStepsY: number = 1;
    public wallpaperOffsetX: number = 0;
    public wallpaperOffsetY: number = 0;


    public bridgeButtonVisibility: BridgeButtonVisibility;
    public drawSystemWallpaperBehindWebViewEnabled: boolean;
    public overscrollEffects: OverscrollEffects;
    public systemNightMode: SystemNightModeOrError;
    public bridgeTheme: BridgeTheme;
    public statusBarAppearance: SystemBarAppearance;
    public navigationBarAppearance: SystemBarAppearance;
    public canLockScreen: boolean;

    
    constructor(config?: BridgeMockConfig)
    {
        this.config = config ?? createDefaultBridgeMockConfig();

        this.bridgeButtonVisibility = this.config.initialBridgeButtonVisibility;
        this.drawSystemWallpaperBehindWebViewEnabled = this.config.initialDrawSystemWallpaperBehindWebViewEnabled;
        this.overscrollEffects = this.config.initialOverscrollEffects;
        this.systemNightMode = this.config.initialSystemNightMode;
        this.bridgeTheme = this.config.initialBridgeTheme;
        this.statusBarAppearance = this.config.initialStatusBarAppearance;
        this.navigationBarAppearance = this.config.initialNavigationBarAppearance;
        this.canLockScreen = this.config.initialCanLockScreen;
    }

    // system

    getAndroidAPILevel(): number
    {
        return this.config.apiLevel;
    }

    getBridgeVersionCode(): number {
        return this.config.bridgeVersionCode;
    }
    
    getBridgeVersionName(): string {
        return this.config.bridgeVersionName;
    }

    getLastErrorMessage(): string | null
    {
        return this.lastErrorMessage;
    }


    // fetch

    getProjectURL(): string
    {
        return this.config.projectUrl;
    }

    getAppsURL(): string
    {
        return this.config.appsUrl;
    }

    getDefaultAppIconURL(packageName: string): string 
    {
        return this.config.makeGetDefaultIconUrl(packageName);
    }


    // apps

    requestAppUninstall(packageName: string, showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestAppUninstall: ${packageName}`);
        this.raiseBridgeEvent('appRemoved', { packageName });
        return true;
    }

    requestOpenAppInfo(packageName: string, showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestOpenAppInfo: ${packageName}`);
        return true;
    }

    requestLaunchApp(packageName: string, showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} Requested launch ${packageName}`);
        return true;
    }


    // wallpaper

    private _padNum(n: number) 
    {
        const s = n.toFixed(4);
        return `${' '.repeat(Math.max(0, 6 - s.length))}${s}`;
    }

    setWallpaperOffsetSteps(x: number, y: number): void
    {
        this.wallpaperOffsetStepsX = x;
        this.wallpaperOffsetStepsY = y;
        if (this.config.logWallpaperEvents)
            console.log(`${this._prefix} setWallpaperOffsetSteps: x = ${this._padNum(x)} y = ${y} (pages: x = ${Math.round(1 / x) - 1}, y = ${Math.round(1 / y) - 1})`);
    }

    setWallpaperOffsets(x: number, y: number): void
    {
        this.wallpaperOffsetX = x;
        this.wallpaperOffsetY = y;
        if (this.config.logWallpaperScrolling)
            console.log(`${this._prefix} setWallpaperOffsets: x = ${this._padNum(x)} y = ${this._padNum(y)} (pages: x = ${this._padNum(x / this.wallpaperOffsetStepsX)} y = ${this._padNum(y / this.wallpaperOffsetStepsY)})`);
    }

    sendWallpaperTap(x: number, y: number, z: number = 0): void
    {
        if (this.config.logWallpaperEvents)
            console.log(`${this._prefix} sendWallpaperTap: x = ${x}, y = ${y}`);
    }

    requestChangeSystemWallpaper(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestChangeSystemWallpaper`);
        return true;
    }


    // Bridge button

    getBridgeButtonVisibility(): BridgeButtonVisibility
    {
        return this.bridgeButtonVisibility;
    }

    requestSetBridgeButtonVisibility(state: BridgeButtonVisibility, showToastIfFailed?: boolean): boolean
    {
        this.bridgeButtonVisibility = state;
        this.raiseBridgeEvent('bridgeButtonVisibilityChanged', { newValue: state });
        return true;
    }


    // draw system wallpaper behind webview

    getDrawSystemWallpaperBehindWebViewEnabled(): boolean
    {
        return this.drawSystemWallpaperBehindWebViewEnabled;
    }

    requestSetDrawSystemWallpaperBehindWebViewEnabled(enable: boolean, showToastIfFailed?: boolean): boolean
    {
        this.drawSystemWallpaperBehindWebViewEnabled = enable;
        this.raiseBridgeEvent('drawSystemWallpaperBehindWebViewChanged', { newValue: enable });
        return true;
    }


    // overscroll effects

    getOverscrollEffects(): OverscrollEffects {
        return this.overscrollEffects;
    }
    
    requestSetOverscrollEffects(effects: OverscrollEffects, showToastIfFailed?: boolean | undefined): boolean {
        this.overscrollEffects = effects;
        this.raiseBridgeEvent('overscrollEffectsChanged', { newValue: effects });
        return true;
    }


    // system night mode

    getSystemNightMode(): SystemNightModeOrError
    {
        return this.systemNightMode;
    }

    resolveIsSystemInDarkTheme(): boolean
    {
        return this.systemNightMode === 'yes'
            || (
                this.systemNightMode !== 'no'
                && matchMedia('(prefers-color-scheme: dark)').matches
            );
    }

    getCanRequestSystemNightMode(): boolean
    {
        return this.config.canRequestSystemNightMode;
    }

    requestSetSystemNightMode(mode: SystemNightMode, showToastIfFailed?: boolean): boolean
    {
        this.systemNightMode = mode;
        this.raiseBridgeEvent('systemNightModeChanged', { newValue: mode });
        return true;
    }


    // Bridge theme

    getBridgeTheme(): BridgeTheme
    {
        return this.bridgeTheme;
    }

    requestSetBridgeTheme(theme: BridgeTheme, showToastIfFailed?: boolean): boolean
    {
        this.bridgeTheme = theme;
        this.raiseBridgeEvent('bridgeThemeChanged', { newValue: theme });
        return true;
    }


    // system bars

    getStatusBarAppearance(): SystemBarAppearance
    {
        return this.statusBarAppearance;
    }

    requestSetStatusBarAppearance(appearance: SystemBarAppearance, showToastIfFailed?: boolean): boolean
    {
        this.statusBarAppearance = appearance;
        this.raiseBridgeEvent('statusBarAppearanceChanged', { newValue: appearance });
        this.raiseBridgeEvent('statusBarsWindowInsetsChanged', { newValue: this._getStatusBarsWindowInsets() });
        this.raiseBridgeEvent('systemBarsWindowInsetsChanged', { newValue: this._getSystemBarsWindowInsets() });
        return true;
    }

    getNavigationBarAppearance(): SystemBarAppearance
    {
        return this.navigationBarAppearance;
    }

    requestSetNavigationBarAppearance(appearance: SystemBarAppearance, showToastIfFailed?: boolean): boolean
    {
        this.navigationBarAppearance = appearance;
        this.raiseBridgeEvent('navigationBarAppearanceChanged', { newValue: appearance });
        this.raiseBridgeEvent('navigationBarsWindowInsetsChanged', { newValue: this._getNavigationBarsWindowInsets() });
        this.raiseBridgeEvent('systemBarsWindowInsetsChanged', { newValue: this._getSystemBarsWindowInsets() });
        return true;
    }


    // screen locking

    getCanLockScreen(): boolean
    {
        return this.canLockScreen;
    }

    requestLockScreen(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestLockScreen`);
        return true;
    }


    // misc actions

    requestOpenBridgeSettings(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestOpenBridgeSettings`);
        return true;
    }

    requestOpenBridgeAppDrawer(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestOpenBridgeAppDrawer`);
        return true;
    }

    requestOpenDeveloperConsole(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestOpenDeveloperConsole`);
        return true;
    }

    requestExpandNotificationShade(showToastIfFailed?: boolean): boolean
    {
        alert(`${this._prefix} requestExpandNotificationShade`);
        return true;
    }


    // toast

    showToast(message: string, long?: boolean): void
    {
        console.log(`${this._prefix} showToast: ${long ? 'long' : 'short'}, message: ${message}`);
    }


    // window insets & cutouts

    protected _getStatusBarsWindowInsets(): WindowInsets
    {
        return windowInsets(0, this.statusBarAppearance === 'hide' ? 0 : this.config.statusBarHeight, 0, 0);
    }

    getStatusBarsWindowInsets(): string
    {
        return this.windowInsetsString(this._getStatusBarsWindowInsets());
    }

    getStatusBarsIgnoringVisibilityWindowInsets(): string
    {
        return this.windowInsetsString(0, this.config.statusBarHeight, 0, 0);
    }

    protected _getNavigationBarsWindowInsets(): WindowInsets
    {
        return windowInsets(0, 0, 0, this.navigationBarAppearance === 'hide' ? 0 : this.config.navigationBarHeight);
    }

    getNavigationBarsWindowInsets(): string
    {
        return this.windowInsetsString(this._getNavigationBarsWindowInsets());
    }

    getNavigationBarsIgnoringVisibilityWindowInsets(): string
    {
        return this.windowInsetsString(0, 0, 0, this.config.navigationBarHeight);
    }

    getCaptionBarWindowInsets(): string
    {
        return this.windowInsetsString(this.config.captionBarWindowInsets);
    }

    getCaptionBarIgnoringVisibilityWindowInsets(): string
    {
        return this.windowInsetsString(this.config.captionBarIgnoringVisibilityWindowInsets);
    }

    protected _getSystemBarsWindowInsets(): WindowInsets
    {
        return windowInsets(
            0,
            this.statusBarAppearance === 'hide' ? 0 : this.config.statusBarHeight,
            0,
            this.navigationBarAppearance === 'hide' ? 0 : this.config.navigationBarHeight,
        );
    }

    getSystemBarsWindowInsets(): string
    {
        return this.windowInsetsString(this._getSystemBarsWindowInsets());
    }

    getSystemBarsIgnoringVisibilityWindowInsets(): string
    {
        return this.windowInsetsString(
            0,
            this.config.statusBarHeight,
            0,
            this.config.navigationBarHeight
        );
    }

    getImeWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.imeWindowInsets);
    }

    getImeAnimationSourceWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.imeAnimationSourceWindowInsets);
    }

    getImeAnimationTargetWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.imeAnimationTargetWindowInsets);
    }

    getTappableElementWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.tappableElementWindowInsets);
    }

    getTappableElementIgnoringVisibilityWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.tappableElementIgnoringVisibilityWindowInsets);
    }

    getSystemGesturesWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.systemGesturesWindowInsets);
    }

    getMandatorySystemGesturesWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.mandatorySystemGesturesWindowInsets);
    }

    getDisplayCutoutWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.displayCutoutWindowInsets);
    }

    getWaterfallWindowInsets(): WindowInsetsJson
    {
        return this.windowInsetsString(this.config.waterfallWindowInsets);
    }


    getDisplayCutoutPath(): string | null
    {
        return this.config.displayCutoutPath;
    }

    getDisplayShapePath(): string | null
    {
        return this.config.displayShapePath;
    }


    // helpers

    protected windowInsetsString(insets: WindowInsets): WindowInsetsJson;
    protected windowInsetsString(left: number, top: number, right: number, bottom: number): WindowInsetsJson;
    protected windowInsetsString(leftOrInsets: number | WindowInsets, top?: number, right?: number, bottom?: number): WindowInsetsJson
    {
        if (typeof leftOrInsets === 'object')
            return JSON.stringify(leftOrInsets);
        else
            return JSON.stringify(<WindowInsets>{ left: leftOrInsets, top, right, bottom });
    }

    public raiseBridgeEvent(...event: BridgeEventListenerArgs)
    {
        if (this.config.logRaisedBridgeEvents)
        {
            const [name, args] = event;
            console.log(`[BridgeMock] raiseBridgeEvent(${name}): args:`, args);
        }

        onBridgeEvent?.(...event);
    }
}