import { Choice } from '@app/classes/choice';

export class Segment {
    id: number;
    paragraphs: any[];
    lastChoice: Choice;
    choiceIndex: number;

    constructor(_paragraphs: any[], lastChoice?: Choice) {
        this.id = Math.floor(Math.random() * 9999);
        this.paragraphs = _paragraphs;
        if (lastChoice) {
            this.lastChoice = lastChoice;
            this.choiceIndex = lastChoice.index;
        }
    }
}
