import { Choice } from '@core/classes/choice';

export interface Segment {
    id: number;
    paragraphs: any[];
    lastChoice: Choice;
    choiceIndex: number;
}
