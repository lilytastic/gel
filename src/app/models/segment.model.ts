import { Choice } from '@app/classes/choice';
import { Paragraph } from '../classes/segment';

export interface Segment {
    id: number;
    paragraphs: Paragraph[];
    lastChoice: Choice;
    choiceIndex: number;
}
