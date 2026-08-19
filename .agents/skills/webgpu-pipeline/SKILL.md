---
name: webgpu-pipeline
description: >-
  WebGPU native graphics and compute architecture: GPUAdapter, GPUDevice, RenderPipeline,
  BindGroups, Uniform Buffers, Storage Buffers, WGSL compute shaders, and indirect drawing.
---

# Modern WebGPU Architecture & Pipelines

WebGPU provides low-overhead, explicit GPU access with high multithreading capabilities and native Compute Shader support.

---

## 1. WebGPU Initialization & Render Pipeline Setup

```typescript
export async function initWebGPU(canvas: HTMLCanvasElement) {
  if (!navigator.gpu) throw new Error("WebGPU not supported on this browser.");

  const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
  if (!adapter) throw new Error("No appropriate GPU adapter found.");

  const device = await adapter.requestDevice();
  const context = canvas.getContext("webgpu") as GPUCanvasContext;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  context.configure({
    device,
    format: presentationFormat,
    alphaMode: "premultiplied",
  });

  return { device, context, presentationFormat };
}
```

## 2. WGSL Compute Shader with Storage Buffers

```wgsl
struct Particle {
    position : vec4<f32>,
    velocity : vec4<f32>,
};

@group(0) @binding(0) var<storage, read_write> particles : array<Particle>;

@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) GlobalInvocationID : vec3<u32>) {
    let index = GlobalInvocationID.x;
    var p = particles[index];
    p.position += p.velocity * 0.016;
    particles[index] = p;
}
```
