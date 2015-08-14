import Surface from './Surface';

const surface = new Surface('canvas');

surface.buildDummy();

document.querySelector('[name="exportAsJson"]').addEventListener('click', () => surface.exportAsJson());
