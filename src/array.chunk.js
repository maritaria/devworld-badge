export function chunk(array, size) {
  if (size <= 0) throw new TypeError('Chunks must have a size that is larger than zero');
  if (!array.length) return [];
  return array.reduce((chunks, item) => {
    let tail = chunks.at(-1);
    if (tail.length >= size) {
      tail = [];
      chunks.push(tail);
    }
    tail.push(item);

    return chunks;
  }, [[]]);
};
