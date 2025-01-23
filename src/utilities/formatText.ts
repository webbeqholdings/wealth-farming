export function capitalizeWords(text: string) {
  function _capitalizeWords(words: string) {
    return words
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  return _capitalizeWords(text)
}
