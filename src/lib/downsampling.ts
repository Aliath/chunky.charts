import { LRUCache } from 'lru-cache';

type BucketKey = `bucket:${number}-${number}`;
export type BucketData = {
  min: number;
  max: number;
  y: number;
  errorY: number;
  x: number;
  sumY: number;
  count: number;
  squareSumY: number;
};

// we render up to 1000 points on the chart; for the max dataset size 100m, that gives us up to 100k buckets
// but let's be real: 50k buckets feels like a solid middle ground, balancing memory usage and performance nicely
const bucketCache = new LRUCache<BucketKey, BucketData>({ max: 50_000 });

export const clearBucketCache = () => {
  bucketCache.clear();
};

// this function takes the original dataset in memory along with L and R pointers
// iterates over the range, and computes stats for a single bucket
const computeBucketData = (data: Float64Array, firstPointIndex: number, lastPointIndex: number): BucketData => {
  let min = Infinity;
  let max = -Infinity;
  let sumX = 0;
  let sumY = 0;
  let count = 0;
  let squareSumY = 0;
  let errorY = -Infinity;
  const representativeY = data[firstPointIndex * 2 + 1];

  for (let i = firstPointIndex * 2; i <= lastPointIndex * 2; i += 2) {
    const x = data[i];
    const y = data[i + 1];

    sumX += x;
    sumY += y;
    squareSumY += y ** 2;
    min = Math.min(min, y);
    max = Math.max(max, y);
    count++;
    errorY = Math.max(errorY, Math.abs(y - representativeY));
  }

  const avgX = sumX / count;

  return {
    x: avgX,
    y: representativeY,
    count,
    sumY,
    min,
    max,
    errorY,
    squareSumY,
  };
};

/**
 * Downsamples the original dataset to a specified number of buckets
 * (note: it might produce one extra bucket: check test cases for detailed exapmle)
 *
 * Takes left and right edge indexes to create buckets based on the given range.
 * The `cache` parameter is used to compare performance with and without LRU caching.
 */
export const downsample = ({
  data,
  bucketsCount: numPoints,
  viewStartIndex,
  viewEndIndex,
  cache = true,
}: {
  data: Float64Array;
  bucketsCount: number;
  viewStartIndex: number;
  viewEndIndex: number;
  cache?: boolean;
}): BucketData[] => {
  if (data.length === 0) {
    return [];
  }

  const viewportSize = viewEndIndex - viewStartIndex;
  const fixedBucketSize = Math.max(1, Math.floor(viewportSize / numPoints));

  const allPointsCount = data.length / 2;
  const lastPointIndex = allPointsCount - 1;
  const lastPossibleBucketIndex = Math.floor(lastPointIndex / fixedBucketSize);

  const result: BucketData[] = [];
  const firstBucketIndex = Math.max(0, Math.floor(viewStartIndex / fixedBucketSize));
  const lastBucketIndex = Math.min(lastPossibleBucketIndex, Math.floor(viewEndIndex / fixedBucketSize) - 1);

  let skippedInFirstBucketsCount = 0;

  for (let bucketIndex = firstBucketIndex; bucketIndex <= lastBucketIndex; bucketIndex++) {
    let firstItemIndex = Math.max(bucketIndex * fixedBucketSize, 0);
    let lastItemIndex = (bucketIndex + 1) * fixedBucketSize - 1;

    if (bucketIndex === firstBucketIndex && viewStartIndex > firstItemIndex) {
      skippedInFirstBucketsCount = viewStartIndex - firstItemIndex;

      firstItemIndex += skippedInFirstBucketsCount;
    } else if (bucketIndex === lastBucketIndex) {
      lastItemIndex += skippedInFirstBucketsCount;
    }

    lastItemIndex = Math.min(lastItemIndex, lastPointIndex);

    const bucketKey = `bucket:${firstItemIndex}-${lastItemIndex}` satisfies BucketKey;
    let bucketData = cache ? bucketCache.get(bucketKey) : undefined;

    if (!bucketData) {
      bucketData = computeBucketData(data, firstItemIndex, lastItemIndex);

      if (cache) {
        bucketCache.set(bucketKey, bucketData);
      }
    }

    result.push(bucketData);
  }

  return result;
};
