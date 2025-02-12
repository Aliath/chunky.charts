# chunky.charts

Big data? No problem. chunky.charts efficiently renders massive datasets by leveraging optimized data structures, smart downsampling, and caching. Designed for performance, it ensures smooth visualization even with hundreds of millions of points. 🚀


https://github.com/user-attachments/assets/64a1e1e8-791d-444a-98d0-fbbc9827e1a3




## Requirements & Installation

- make sure you're running Node.js version >= 22 (tested on this version)
- install dependencies: `npm install`
- run the development server: `npm run dev`
- want to test or experiment with the downsample function? `npm run test`

## Assumptions & Interpretation

- I assumed that the points are already sorted by x values, so x*n < x*(n+1)
- performance and handling large datasets were my primary focus for data rendering
- to avoid blocking the main thread, data is imported in smalller chunks; this ensures a smooth experience (on my machine, loading 100 million points takes about 20 seconds)

## Key Implementation Highlights

1. **Efficient Data Structure**

I used `Float64Array` to store data efficiently, which makes keeping hundreds of millions of points in memory feasible. Initially, I tried a naive approach with standard JS objects but quickly realized it wasn't scalable. Data is stored as: `[x_0, y_0, x_1, y_1, ..., x_n, y_n]`

2. **Downsampling for Performance**

The downsampling function divides the visible data frame into `min(visible points, 1_000)` buckets. This ensures the chart never renders more than 1,000 points, even for large datasets

3. **Fast Aggregate Calculation**

Thanks to precomputed bucket statistics, aggregates can be computed efficiently. Let's just say I had a bit of a "eureka moment" when figuring out how to speed this up beyond the naive O(n) approach

4. **Handling Large Datasets with Caching**

Computing buckets for massive datasets can still take time, especially with fast "play" intervals. To address this, I added an LRU cache to reuse buckets after the initial computation (side note: I wasn't sure if external libraries like this were allowed, but I hope using LRU won't get me in trouble)

5. **Aggregate accuracy**

I validated bucket-based aggregates against a naive approach (iterating over all points). After fixing some issues, I found no mismatches. The validation code wasn't included to keep the final app performant

6. **Documentation**

I've added JSDoc comments to describe the purpose of the most significant functions. For areas where the code is either self-explanatory or less critical, I didn’t add comments to keep things clean and focused
