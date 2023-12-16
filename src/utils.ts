import { WindowInsets } from "@theothertored/bridge-api";

export function windowInsets(left: number, top: number, right: number, bottom: number): WindowInsets
{
    return { left, top, right, bottom };
}