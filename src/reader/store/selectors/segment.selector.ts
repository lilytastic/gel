import { ReaderState } from '../reducers/segment.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export const READER_FEATURE_KEY = 'Reader Feature';

export const getReaderFeatureState = createFeatureSelector<ReaderState>(READER_FEATURE_KEY);

export const getSegmentsState = createSelector(getReaderFeatureState, (state) => state && state.segments);
export const getAllParagraphs = createSelector(getReaderFeatureState,
	(state) => state && state.segments.reduce((acc, currentValue) => acc = acc.concat(currentValue.paragraphs), []));
