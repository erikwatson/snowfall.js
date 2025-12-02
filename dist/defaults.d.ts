import { BaseConfig, BaseLayerConfig, CompleteUserConfig, Config, ImageLayerConfig, SimpleLayerConfig } from './types';
export declare const DEFAULT_CONTAINER_ID = "snowfall";
export declare const DEFAULT_SNOW_COLOR = "#ffffff";
export declare const DEFAULT_DENSITY = 200;
export declare const DEFAULT_MASS_MIN = 1;
export declare const DEFAULT_MASS_MAX = 3;
export declare const DEFAULT_SIZE_MIN = 1;
export declare const DEFAULT_SIZE_MAX = 3;
export declare const DEFAULT_ROTATE = false;
export declare const DEFAULT_MODE = "simple";
export declare const DEFAULT_IMAGE = "data:image/png;base64,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";
export declare const DEFAULT_OPACITY_MIN = 0;
export declare const DEFAULT_OPACITY_MAX = 1;
export declare const DEFAULT_MASS: {
    min: number;
    max: number;
};
export declare const DEFAULT_SIZE: {
    min: number;
    max: number;
};
export declare const DEFAULT_OPACITY: {
    min: number;
    max: number;
};
export declare const DEFAULT_AMPLITUDE = 1;
export declare const DEFAULT_FREQUENCY = 0.02;
export declare const DEFAULT_SWAY: {
    frequency: number;
    amplitude: number;
};
export declare const DEFAULT_GRAVITY_ANGLE = 90;
export declare const DEFAULT_GRAVITY_STRENGTH = 0.7;
export declare const DEFAULT_GRAVITY: {
    angle: number;
    strength: number;
};
export declare const DEFAULT_WIND_ANGLE = 0;
export declare const DEFAULT_WIND_STRENGTH = 0;
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
export declare const DEFAULT_WIND_GUSTS_CHANGE_CHANCE = 0.25;
export declare const DEFAULT_WIND_GUSTS_ACTIVE = true;
export declare const DEFAULT_WIND_GUSTS_OUT: {
    duration: {
        min: number;
        max: number;
    };
    delay: {
        min: number;
        max: number;
    };
};
export declare const DEFAULT_WIND_GUSTS_IN: {
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
export declare const DEFAULT_WIND_GUSTS: {
    active: boolean;
    changeChance: number;
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
    };
};
export declare const DEFAULT_WIND: {
    angle: number;
    strength: number;
    gusts: {
        active: boolean;
        changeChance: number;
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
        };
    };
};
export declare const BASE_LAYER_CONFIG: BaseLayerConfig;
export declare const DEFAULT_SIMPLE_LAYER: SimpleLayerConfig;
export declare const DEFAULT_IMAGE_LAYER: ImageLayerConfig;
export declare const DEFAULT_LAYERS: SimpleLayerConfig[];
export declare const DEFAULT_BASE_CONFIG: BaseConfig;
export declare function getDefaultConfig(): Config;
export declare const DEFAULT_USER_CONFIG: CompleteUserConfig;
