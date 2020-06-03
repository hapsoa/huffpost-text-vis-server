/**
 * Search Process Visualization interfaces
 */
import {Fivew1h} from "./refiningInterfaces";

export interface SunburstDatum {
    keyword: string;
    relatedFrequency?: number;
    fivew1h?: Fivew1h;
    children?: SunburstDatum[];
}