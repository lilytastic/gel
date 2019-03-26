import { Choice } from '@app/classes/choice';

export class Segment {
    id: number;
    paragraphs: Paragraph[];
    lastChoice: Choice;
    choiceIndex: number;

    constructor(_paragraphs: Paragraph[], lastChoice?: Choice) {
        this.id = Math.floor(Math.random() * 9999);
        this.paragraphs = _paragraphs;
        if (lastChoice) {
            this.lastChoice = lastChoice;
            this.choiceIndex = lastChoice.index;
        }
    }
}

export class Paragraph {
    type: ParagraphType;
    text: string;
    options: any;
}

export enum ParagraphType {
    Paragraph,
    Dialogue
}
