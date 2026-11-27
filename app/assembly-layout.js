// The sculpture and its scroll controller share one header-aware coordinate system.
export function assemblyViewport(viewportHeight, headerHeight = 0) {
  const pinTop = Math.max(0, Math.ceil(headerHeight));
  return { pinTop, height: Math.max(1, viewportHeight - pinTop) };
}

export function assemblyBounds(root, stage, pageY = scrollY) {
  const pinTop = parseFloat(root.style.getPropertyValue('--assembly-pin-top')) || 0;
  return {
    start: root.getBoundingClientRect().top + pageY - pinTop,
    length: Math.max(1, root.offsetHeight - stage.offsetHeight),
  };
}
