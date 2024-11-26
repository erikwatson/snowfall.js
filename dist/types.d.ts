import { Graphics, Vec2 } from '@erikwatson/bramble';
export type ConfigLayer = {
    /**
     * A hex string representing the colour of the snowflakes in the foreground.
     * @default '#8d90b7'
     */
    colour: string;
    /**
     * A number representing the required density of snowflakes on screen. Note, this is not the actual number of snowflakes.
     * @default 200
     */
    density: number;
    /**
     * Should the snowflakes grow in size when the app starts or should they begin at their full size?
     * @default true
     */
    fadeIn: boolean;
    wave: {
        /**
         * The frequency of the wave the snowflakes follow.
         * @default 0.02
         */
        frequency: number;
        /**
         * The amplitude of the wave the snowflakes follow.
         * @default 1.0
         */
        amplitude: number;
    };
    gravity: {
        /**
         * The angle of gravity, in degrees.
         * @default 90
         */
        angle: number;
        /**
         * The strength of gravity.
         * @default 0.7
         */
        strength: number;
        /**
         * Should gravity respect device orientation?
         * This takes precedence over the angle settings.
         * @default false
         */
        respectOrientation: boolean;
    };
    wind: {
        /**
         * The angle of the wind, in degrees.
         * @default 0
         */
        angle: number;
        /**
         * The strength of the wind.
         * @default 0
         */
        strength: number;
        /**
         * Should the wind gust?
         * @default true
         */
        gusts: boolean;
        in: {
            /**
             * The minimum and maximum strength to add to the wind gusts.
             * @default { min: 1, max: 3 }
             */
            additionalStrength: {
                min: number;
                max: number;
            };
            /**
             * The minimum and maximum duration of the wind gusts.
             * @default { min: 1000, max: 3000 }
             */
            duration: {
                min: number;
                max: number;
            };
            /**
             * The minimum and maximum delay before the wind eases off.
             * @default { min: 5000, max: 10000 }
             */
            delay: {
                min: number;
                max: number;
            };
        };
        out: {
            /**
             * The minimum and maximum duration of the wind gusts.
             * @default { min: 5000, max: 10000 }
             */
            duration: {
                min: number;
                max: number;
            };
            /**
             * The minimum and maximum delay before the wind eases off.
             * @default { min: 1000, max: 10000 }
             */
            delay: {
                min: number;
                max: number;
            };
            /**
             * The likelihood of the wind changing direction after a gust. 0.0 is never, 1.0 is always.
             * @default 0.25
             */
            changeChance: number;
        };
    };
};
export interface BaseConfig {
    [key: string]: any;
    /**
     * A hex string representing the Background Colour of the canvas.
     * @default '#0d0014'
     */
    background: string;
    /**
     * An array of uniquely configured snowflake layers.
     */
    layers: ConfigLayer[];
}
export interface Config extends BaseConfig {
    /**
     * The element to attach the simulation to.
     * @default '#snowfall'
     */
    attachTo: HTMLElement;
}
export interface UserConfig extends Partial<BaseConfig> {
    /**
     * A string that represents the ID of an element you want to attach snowfall to.
     * @default '#snowfall'
     */
    attachTo?: string;
}
export interface UserSchedule {
    /** The date from which to start the simulation */
    from: {
        /** The day of the month, starting at 1 */
        day: number;
        /** The month of the year, starting at 1 */
        month: number;
    };
    /** The date on which to end the simulation */
    to: {
        /** The day of the month, starting at 1 */
        day: number;
        /** The month of the year, starting at 1 */
        month: number;
    };
}
export type Snowflake = {
    position: Vec2;
    size: number;
    renderedSize: number;
    noise: number;
    time: number;
    amplitude: number;
    frequency: number;
    random: number;
    colour: string;
};
export interface Simulation {
    start: (config: UserConfig) => void;
    setAmplitude: (num: number, layer: number) => void;
    setBackground: (col: string) => void;
    setDensity: (den: number, layer: number) => void;
    setFade: (val: boolean, layer: number) => void;
    setFrequency: (freq: number, layer: number) => void;
    setGravity: (degrees: number, strength: number, layer: number) => void;
    setGravityAngle: (degrees: number, layer: number) => void;
    setGravityStrength: (strength: number, layer: number) => void;
    setRespectOrientation: (val: boolean, layer: number) => void;
    setPaused: (pause: boolean, layer: number) => void;
    setWind: (degrees: number, strength: number, layer: number) => void;
    setWindAngle: (degrees: number, layer: number) => void;
    setWindStrength: (strength: number, layer: number) => void;
    setGusts: (gusts: boolean, layer: number) => void;
    togglePaused: (layer: number) => void;
    setWindInAdditionalStrengthMin: (min: number, layer: number) => void;
    setWindInAdditionalStrengthMax: (max: number, layer: number) => void;
    setWindInDurationMin: (min: number, layer: number) => void;
    setWindInDurationMax: (max: number, layer: number) => void;
    setWindInDelayMin: (min: number, layer: number) => void;
    setWindInDelayMax: (max: number, layer: number) => void;
    setWindOutDurationMin: (min: number, layer: number) => void;
    setWindOutDurationMax: (max: number, layer: number) => void;
    setWindOutDelayMin: (min: number, layer: number) => void;
    setWindOutDelayMax: (max: number, layer: number) => void;
    setWindOutChangeChance: (chance: number, layer: number) => void;
    setColour: (colour: string, layer: number) => void;
}
export interface SnowfallLayer {
    config: ConfigLayer;
    start(): void;
    pause(): void;
    resume(): void;
    restart(): void;
    update(dt: number): void;
    render(gfx: Graphics): void;
    setDensity(density: number): void;
    setColour(colour: string): void;
    setAmplitude(num: number): void;
    setDensity(den: number): void;
    setFade(val: boolean): void;
    setFrequency(freq: number): void;
    setGravity(degrees: number, strength: number): void;
    setGravityAngle(degrees: number): void;
    setGravityStrength(strength: number): void;
    setRespectOrientation(val: boolean): void;
    setPaused(pause: boolean): void;
    setWind(degrees: number, strength: number): void;
    setWindAngle(degrees: number): void;
    setWindStrength(strength: number): void;
    setGusts(gusts: boolean): void;
    togglePaused(): void;
    setWindInAdditionalStrengthMin(min: number): void;
    setWindInAdditionalStrengthMax(max: number): void;
    setWindInDurationMin(min: number): void;
    setWindInDurationMax(max: number): void;
    setWindInDelayMin(min: number): void;
    setWindInDelayMax(max: number): void;
    setWindOutDurationMin(min: number): void;
    setWindOutDurationMax(max: number): void;
    setWindOutDelayMin(min: number): void;
    setWindOutDelayMax(max: number): void;
    setWindOutChangeChance(chance: number): void;
    setColour(colour: string): void;
}
