export function compressResults(items = []) {
  return items.map((item) => ({
    step: item.step,
    id: item.id,
    hint: item.hint,
  }));
}

export function mergeCounts(prev = {}, items = []) {
  const updated = { ...prev };

  items.forEach((item) => {
    const step = item.step;
    const id = item.id;

    if (!updated[step]) {
      updated[step] = {};
    }

    if (!updated[step][id]) {
      updated[step][id] = 1;
    } else {
      updated[step][id] += 1;
    }
  });

  return updated;
}
