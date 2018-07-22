import { Segment } from '@core/models/segment.model';

export interface AppState {
    readonly segments: Segment[];
}
