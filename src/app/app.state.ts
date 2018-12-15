import { Segment } from '@app/models/segment.model';

export interface AppState {
    readonly segments: Segment[];
}
