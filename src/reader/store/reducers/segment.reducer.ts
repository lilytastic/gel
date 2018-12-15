import { Segment } from '@app/models/segment.model';
import * as SegmentActions from '../actions/segment.actions';

export interface ReaderState {
    segments: Segment[];
}

export const initState: ReaderState = {
    segments: []
};

export function ReaderReducers(
    state: ReaderState = initState,
    action: SegmentActions.Actions
): ReaderState {
    switch (action.type) {
        case SegmentActions.ADD_SEGMENT:
            return {
                ...state,
                segments: [...state.segments, action.payload]  // Concatenates
            };
        case SegmentActions.REMOVE_SEGMENT:
            return {
                ...state,
                segments: state.segments.splice(action.payload, 1)
            };
        default:
            return state;
    }
}
