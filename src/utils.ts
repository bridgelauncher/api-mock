import { WindowInsets } from "@bridgelauncher/api";

export function windowInsets(left: number, top: number, right: number, bottom: number): WindowInsets
{
    return { left, top, right, bottom };
}