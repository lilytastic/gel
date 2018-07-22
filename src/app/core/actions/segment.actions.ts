import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Segment } from '../models/segment.model';

export const ADD_SEGMENT = '[SEGMENT] Add';
export const REMOVE_SEGMENT = '[SEGMENT] Remove';

export class AddSegment implements Action {
    readonly type = ADD_SEGMENT;

    constructor(public payload: Segment) {}
}

export class RemoveSegment implements Action {
    readonly type = REMOVE_SEGMENT;

    constructor(public payload: number) {}
}

export type Actions = AddSegment | RemoveSegment;
