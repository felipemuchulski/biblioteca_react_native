export type SelectedLocation = {
  latitude: number;
  longitude: number;
};

let selectionHandler: ((location: SelectedLocation) => void) | undefined;

export function setAddressSelectionHandler(
  handler: ((location: SelectedLocation) => void) | undefined,
) {
  selectionHandler = handler;
}

export function publishAddressSelection(location: SelectedLocation) {
  selectionHandler?.(location);
}
