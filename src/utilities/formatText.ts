
export function formatText(text: string){
    function capitalizeWords(words: string) {
        return words.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
    }
    return capitalizeWords(text)
}
  