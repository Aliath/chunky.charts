import { BucketData, clearBucketCache, downsample } from '@/lib/downsampling';

const getExactBucketPoint = (x: number, y: number) =>
  ({
    x,
    y,
    sumY: y,
    squareSumY: y ** 2,
    min: y,
    max: y,
    errorY: 0,
    count: 1,
  }) satisfies BucketData;

const convertToFloatArray = (list: { x: number; y: number }[]) => new Float64Array(list.flatMap(({ x, y }) => [x, y]));

describe('downsample', () => {
  beforeEach(() => {
    clearBucketCache();
  });

  it('should reflect original dataset when numPoints <= data.length', () => {
    expect(
      downsample({
        data: convertToFloatArray([]),
        viewStartIndex: 0,
        viewEndIndex: 100,
        bucketsCount: 100,
      })
    ).toStrictEqual([]);

    expect(
      downsample({
        data: convertToFloatArray([
          { x: 1, y: 1 },
          { x: 2, y: 2 },
        ]),
        viewStartIndex: 0,
        viewEndIndex: 100,
        bucketsCount: 100,
      })
    ).toStrictEqual([getExactBucketPoint(1, 1), getExactBucketPoint(2, 2)]);
  });

  it('should downsample data sets when numPoints % bucketsCount == 0', () => {
    expect(
      downsample({
        data: convertToFloatArray([
          { x: 0, y: 1 },
          { x: 1, y: 1.5 },
          { x: 2, y: 0.5 },
          { x: 3, y: 2 },
        ]),
        viewStartIndex: 0,
        viewEndIndex: 4,
        bucketsCount: 2,
      })
    ).toStrictEqual([
      {
        x: (0 + 1) / 2,
        y: 1,
        sumY: 1 + 1.5,
        squareSumY: 1 ** 2 + 1.5 ** 2,
        min: 1,
        max: 1.5,
        errorY: 1.5 - 1,
        count: 2,
      },
      {
        x: (2 + 3) / 2,
        y: 0.5,
        sumY: 0.5 + 2,
        squareSumY: 0.5 ** 2 + 2 ** 2,
        min: 0.5,
        max: 2,
        errorY: 2 - 0.5,
        count: 2,
      },
    ] satisfies BucketData[]);
  });

  /**
   * here's why we create N + 1 buckets instead of sticking to exactly N when things don’t divide perfectly:
   *
   * 1. It makes sure all items from the current frame are visible.
   * 2. It’s faster this way.
   * 3. We always show real data and proper aggregates.
   *
   * sure, we could do some fancy math with remainders to hit exactly N buckets but for charts, nobody's going to notice, so why bother?
   */
  it('should downsample data sets when numPoints % bucketsCount != 0', () => {
    expect(
      downsample({
        data: convertToFloatArray([
          { x: 0, y: 1 },
          { x: 1, y: 1.5 },
          { x: 2, y: 0.5 },
        ]),
        viewStartIndex: 0,
        viewEndIndex: 3,
        bucketsCount: 2,
      })
    ).toStrictEqual([
      {
        x: 0,
        y: 1,
        sumY: 1,
        squareSumY: 1 ** 2,
        min: 1,
        max: 1,
        errorY: 0,
        count: 1,
      },
      {
        x: 1,
        y: 1.5,
        sumY: 1.5,
        squareSumY: 1.5 ** 2,
        min: 1.5,
        max: 1.5,
        errorY: 0,
        count: 1,
      },
      {
        x: 2,
        y: 0.5,
        sumY: 0.5,
        squareSumY: 0.5 ** 2,
        min: 0.5,
        max: 0.5,
        errorY: 0,
        count: 1,
      },
    ] satisfies BucketData[]);
  });
});
