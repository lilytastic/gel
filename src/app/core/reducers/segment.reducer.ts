import { Action } from '@ngrx/store';
import { Segment } from '../models/segment.model';
import * as SegmentActions from '../actions/segment.actions';

const initialState: Segment = {
    id: 0,
    paragraphs: [ {text: 'test'} ],
    choiceIndex: undefined,
    lastChoice: undefined
};

export function SegmentReducer(state: Segment[] = [initialState], action: SegmentActions.Actions) {
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
