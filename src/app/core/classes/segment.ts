export class Segment {
    id: number;
    paragraphs: any[];
    choiceIndex: number;

    constructor(_paragraphs: any[], lastChoice?: number) {
        this.id = Math.floor(Math.random() * 9999);
        this.paragraphs = _paragraphs;
        this.choiceIndex = lastChoice;
    }
}
