// Type declarations for Quasar virtual modules
declare module '#q-app/wrappers' {
    import type { QuasarContext } from '@quasar/app-vite';

    export function defineConfig(callback: (ctx: QuasarContext) => object): object;
    export function defineStore(callback: (ctx: QuasarContext) => object): object;
    export function boot(callback: (ctx: QuasarContext) => void | Promise<void>): (ctx: QuasarContext) => void | Promise<void>;
}
