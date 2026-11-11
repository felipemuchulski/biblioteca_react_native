import type { Coordinates as SelectedLocation } from './distance';
export type { Coordinates as SelectedLocation } from './distance';

let selectionHandler: ((location: SelectedLocation) => void) | undefined;

export function setAddressSelectionHandler(
  handler: ((location: SelectedLocation) => void) | undefined,
) {
  selectionHandler = handler;
}

export function publishAddressSelection(location: SelectedLocation) {
  selectionHandler?.(location);
}
