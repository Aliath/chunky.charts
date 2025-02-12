import { BucketData } from '@/lib/downsampling';

export const useCurrentAggregates = (downsampledBuckets: BucketData[]) => {
  const min = downsampledBuckets.reduce((result, bucket) => Math.min(bucket.min, result), Infinity);
  const max = downsampledBuckets.reduce((result, bucket) => Math.max(bucket.max, result), -Infinity);
  const sumY = downsampledBuckets.reduce((result, bucket) => bucket.sumY + result, 0);
  const count = downsampledBuckets.reduce((result, bucket) => bucket.count + result, 0);
  const sumSquares = downsampledBuckets.reduce((result, bucket) => bucket.squareSumY + result, 0);
  const avg = sumY / count;
  const variance = sumSquares / count - avg ** 2;

  return { min, max, avg, variance };
};
