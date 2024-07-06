export function getElementOrThrow(id: string): HTMLElement {
  const result = document.getElementById(id)

  if (!result) {
    throw new Error(`Error: Element #${id} not found.`)
  }

  return result
}
