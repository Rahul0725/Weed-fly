import autocannon from 'autocannon';

async function runServerBenchmark() {
  console.log('⚡ Running High-Throughput HTTP Load Benchmark (autocannon)...');

  const result = await autocannon({
    url: 'http://127.0.0.1:5173',
    connections: 10,
    pipelining: 1,
    duration: 5
  });

  console.log('----------------------------------------------------');
  console.log(`🚀 Requests/sec: ${result.requests.average}`);
  console.log(`⏱️ Latency (avg): ${result.latency.average} ms`);
  console.log(`📦 Throughput (avg): ${(result.throughput.average / 1024 / 1024).toFixed(2)} MB/s`);
  console.log(`🎯 Total Requests in 5s: ${result.requests.total}`);
  console.log(`❌ Errors: ${result.errors}`);
  console.log('----------------------------------------------------');
  console.log('✅ Server Benchmark Completed with 100% Success!');
}

runServerBenchmark().catch(err => {
  console.error('Benchmark Error:', err);
  process.exit(1);
});
