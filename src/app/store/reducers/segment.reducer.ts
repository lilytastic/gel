import { Segment } from '@app/models/segment.model';
import * as SegmentActions from '../actions/segment.actions';

export function SegmentReducer(state: Segment[] = [], action: SegmentActions.Actions) {
    switch (action.type) {
        case SegmentActions.ADD_SEGMENT:
            return [...state, action.payload];  // Concatenates
        case SegmentActions.REMOVE_SEGMENT:
            state.splice(action.payload, 1);
            return state;
        default:
            return state;
    }
}
