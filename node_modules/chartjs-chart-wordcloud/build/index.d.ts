/**
 * chartjs-chart-wordcloud
 * https://github.com/sgratzl/chartjs-chart-wordcloud
 *
 * Copyright (c) 2019-2023 Samuel Gratzl <sam@sgratzl.com>
 */

import { ChartType, ScriptableAndArrayOptions, ScriptableContext, FontSpec, Element, VisualElement, CoreChartOptions, CartesianScaleTypeRegistry, DatasetController, UpdateMode, ControllerDatasetOptions, CommonHoverOptions, AnimationOptions, Chart, ChartItem, ChartConfiguration } from 'chart.js';

interface IWordElementOptions extends FontSpec, Record<string, unknown> {
    color: CanvasRenderingContext2D['fillStyle'];
    strokeStyle: CanvasRenderingContext2D['strokeStyle'];
    strokeWidth?: CanvasRenderingContext2D['lineWidth'];
    rotate: number;
    rotationSteps: number;
    minRotation: number;
    maxRotation: number;
    padding: number;
}
interface IWordElementHoverOptions {
    hoverColor: CanvasRenderingContext2D['fillStyle'];
    hoverSize: FontSpec['size'];
    hoverStyle: FontSpec['style'];
    hoverWeight: FontSpec['weight'];
    hoverStrokeStyle: CanvasRenderingContext2D['strokeStyle'];
    hoverStrokeWidth?: CanvasRenderingContext2D['lineWidth'];
}
interface IWordElementProps {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    text: string;
}
declare class WordElement extends Element<IWordElementProps, IWordElementOptions> implements VisualElement {
    static readonly id = "word";
    static readonly defaults: any;
    static readonly defaultRoutes: {
        color: string;
        family: string;
        style: string;
        weight: string;
        lineHeight: string;
    };
    static computeRotation(o: IWordElementOptions, rnd: () => number): number;
    inRange(mouseX: number, mouseY: number): boolean;
    inXRange(mouseX: number): boolean;
    inYRange(mouseY: number): boolean;
    getCenterPoint(): {
        x: number;
        y: number;
    };
    tooltipPosition(): {
        x: number;
        y: number;
    };
    draw(ctx: CanvasRenderingContext2D): void;
}
declare module 'chart.js' {
    interface ElementOptionsByType<TType extends ChartType> {
        word: ScriptableAndArrayOptions<IWordElementOptions & IWordElementHoverOptions, ScriptableContext<TType>>;
    }
}

interface ICloudWord extends IWordElementProps {
    options: IWordElementOptions;
    index: number;
}
declare class WordCloudController extends DatasetController<'wordCloud', WordElement> {
    static readonly id = "wordCloud";
    static readonly defaults: {
        datasets: {
            animation: {
                colors: {
                    properties: string[];
                };
                numbers: {
                    properties: string[];
                };
            };
        };
        maintainAspectRatio: boolean;
        dataElementType: string;
    };
    static readonly overrides: {
        scales: {
            x: {
                type: string;
                min: number;
                max: number;
                display: boolean;
            };
            y: {
                type: string;
                min: number;
                max: number;
                display: boolean;
            };
        };
    };
    private readonly wordLayout;
    rand: () => number;
    update(mode: UpdateMode): void;
    updateElements(elems: WordElement[], start: number, count: number, mode: UpdateMode): void;
    draw(): void;
    getLabelAndValue(index: number): {
        label: string;
        value: any;
    };
}
interface IAutoGrowOptions {
    maxTries: number;
    scalingFactor: number | ((currentFactor: number, fitted: ICloudWord[], total: number) => number);
}
interface IWordCloudControllerDatasetOptions extends ControllerDatasetOptions, ScriptableAndArrayOptions<IWordElementOptions, ScriptableContext<'wordCloud'>>, ScriptableAndArrayOptions<CommonHoverOptions, ScriptableContext<'wordCloud'>>, AnimationOptions<'wordCloud'> {
    fit: boolean;
    autoGrow: IAutoGrowOptions;
    randomRotationSeed: string;
}
declare module 'chart.js' {
    interface ChartTypeRegistry {
        wordCloud: {
            chartOptions: CoreChartOptions<'wordCloud'>;
            datasetOptions: IWordCloudControllerDatasetOptions;
            defaultDataPoint: number;
            metaExtensions: Record<string, never>;
            parsedDataType: {
                x: number;
            };
            scales: keyof CartesianScaleTypeRegistry;
        };
    }
}
declare class WordCloudChart<DATA extends unknown[] = number[], LABEL = string> extends Chart<'wordCloud', DATA, LABEL> {
    static id: string;
    constructor(item: ChartItem, config: Omit<ChartConfiguration<'wordCloud', DATA, LABEL>, 'type'>);
}

export { type IAutoGrowOptions, type IWordCloudControllerDatasetOptions, type IWordElementHoverOptions, type IWordElementOptions, type IWordElementProps, WordCloudChart, WordCloudController, WordElement };
//# sourceMappingURL=index.d.ts.map
