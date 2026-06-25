import { CompleteUserConfig, Config, UserConfig } from './types';
export declare function merge(config: UserConfig): Config;
export declare function merge2(config: UserConfig): CompleteUserConfig;
export declare function diff(config: UserConfig): Partial<UserConfig>;
