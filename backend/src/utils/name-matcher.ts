function normalizeNameWords(name: string): string[] {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(Boolean);
}

function editDistance(first: string, second: string): number {
    const previous = Array.from({ length: second.length + 1 }, (_, index) => index);

    for (let firstIndex = 1; firstIndex <= first.length; firstIndex++) {
        let diagonal = previous[0];
        previous[0] = firstIndex;

        for (let secondIndex = 1; secondIndex <= second.length; secondIndex++) {
            const above = previous[secondIndex];
            previous[secondIndex] = Math.min(
                previous[secondIndex] + 1,
                previous[secondIndex - 1] + 1,
                diagonal + (first[firstIndex - 1] === second[secondIndex - 1] ? 0 : 1)
            );
            diagonal = above;
        }
    }

    return previous[second.length];
}

function wordsMatch(first: string, second: string): boolean {
    if (first === second) return true;

    // Only permit a single inserted, removed, or replaced character.
    // Do not use partial-word matching, which can return unrelated names.
    return first.length >= 4 && second.length >= 4 && editDistance(first, second) <= 1;
}

/** Matches names regardless of capitalization or punctuation, allowing one typo per word. */
export function nameMatches(query: string, fullName: string): boolean {
    const queryWords = normalizeNameWords(query);
    const nameWords = normalizeNameWords(fullName);

    return queryWords.every(queryWord =>
        nameWords.some(nameWord => wordsMatch(queryWord, nameWord))
    );
}
