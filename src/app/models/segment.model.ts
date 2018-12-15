import { Choice } from '@app/classes/choice';

export interface Segment {
    id: number;
    paragraphs: any[];
    lastChoice: Choice;
    choiceIndex: number;
}
