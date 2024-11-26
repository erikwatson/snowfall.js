import { BaseConfig, Config, ConfigLayer, UserConfig } from './types';
export declare const DEFAULT_CONTAINER_ID = "snowfall";
export declare const DEFAULT_CONTAINER: HTMLElement;
export declare const DEFAULT_BACKGROUND = "#0d0014";
export declare const DEFAULT_PRIMARY_COLOR = "#8d90b7";
export declare const DEFAULT_SECONDARY_COLOR = "#ffffff";
export declare const DEFAULT_DENSITY = 200;
export declare const DEFAULT_FADE_IN = true;
export declare const DEFAULT_AMPLITUDE = 1;
export declare const DEFAULT_FREQUENCY = 0.02;
export declare const DEFAULT_WAVE: {
    frequency: number;
    amplitude: number;
};
export declare const DEFAULT_GRAVITY_ANGLE = 90;
export declare const DEFAULT_GRAVITY_STRENGTH = 0.7;
export declare const DEFAULT_RESPECT_ORIENTATION = false;
export declare const DEFAULT_GRAVITY: {
    angle: number;
    strength: number;
    respectOrientation: boolean;
};
export declare const DEFAULT_WIND_ANGLE = 0;
export declare const DEFAULT_WIND_STRENGTH = 0;
export declare const DEFAULT_WIND_GUSTS = true;
export declare const DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MIN = 1;
export declare const DEFAULT_WIND_IN_ADDITIONAL_STRENGTH_MAX = 3;
export declare const DEFAULT_WIND_IN_ADDITIONAL_STRENGTH: {
    min: number;
    max: number;
};
export declare const DEFAULT_WIND_IN_DURATION_MIN = 1000;
export declare const DEFAULT_WIND_IN_DURATION_MAX = 3000;
export declare const DEFAULT_WIND_IN_DURATION: {
    min: number;
    max: number;
};
export declare const DEFAULT_WIND_IN_DELAY_MIN = 1000;
export declare const DEFAULT_WIND_IN_DELAY_MAX = 10000;
export declare const DEFAULT_WIND_IN_DELAY: {
    min: number;
    max: number;
};
export declare const DEFAULT_WIND_OUT_DELAY_MIN = 5000;
export declare const DEFAULT_WIND_OUT_DELAY_MAX = 10000;
export declare const DEFAULT_WIND_OUT_DELAY: {
    min: number;
    max: number;
};
export declare const DEFAULT_WIND_OUT_DURATION_MAX = 10000;
export declare const DEFAULT_WIND_OUT_DURATION_MIN = 1000;
export declare const DEFAULT_WIND_OUT_DURATION: {
    min: number;
    max: number;
};
export declare const DEFAULT_WIND_OUT_CHANGE_CHANCE = 0.25;
export declare const DEFAULT_WIND_OUT: {
    duration: {
        min: number;
        max: number;
    };
    delay: {
        min: number;
        max: number;
    };
    changeChance: number;
};
export declare const DEFAULT_WIND_IN: {
    additionalStrength: {
        min: number;
        max: number;
    };
    duration: {
        min: number;
        max: number;
    };
    delay: {
        min: number;
        max: number;
    };
};
export declare const DEFAULT_WIND: {
    angle: number;
    strength: number;
    gusts: boolean;
    in: {
        additionalStrength: {
            min: number;
            max: number;
        };
        duration: {
            min: number;
            max: number;
        };
        delay: {
            min: number;
            max: number;
        };
    };
    out: {
        duration: {
            min: number;
            max: number;
        };
        delay: {
            min: number;
            max: number;
        };
        changeChance: number;
    };
};
export declare const DEFAULT_LAYER: ConfigLayer;
export declare const DEFAULT_LAYERS: ConfigLayer[];
export declare const DEFAULT_BASE_CONFIG: BaseConfig;
export declare const DEFAULT_CONFIG: Config;
export declare const DEFAULT_USER_CONFIG: UserConfig;
