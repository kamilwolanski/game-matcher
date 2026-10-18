import result from '../../stylized-enrichment-results.json';

const filtered = result.filter((item) => item.ai.score === 0.75 && item.ai.confidence >= 0.95);

console.log(filtered.map((x) => `${x.name}, slug: ${x.slug}`));

