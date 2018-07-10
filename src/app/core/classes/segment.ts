export class Segment {
    id: number;
    paragraphs: any[];

    constructor(_paragraphs: any[], _id?: number) {
        this.id = _id || Math.floor(Math.random() * 9999);
        this.paragraphs = _paragraphs;
    }
}
