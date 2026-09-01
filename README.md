[![Automatic version updates](https://github.com/zopencommunity/llama.cppport/actions/workflows/bump.yml/badge.svg)](https://github.com/ZOSOpenTools/llama.cppport/actions/workflows/bump.yml)

# llama.cpp

Enable AI inferencing on z/OS

# Installation and Usage

Use the zopen package manager ([QuickStart Guide](https://zopen.community/#/Guides/QuickStart)) to install:
```bash
zopen install llamacpp
```

# Building from Source

1. Clone the repository:
```bash
git clone https://github.com/zopencommunity/llamacppport.git
cd llamacppport
```
2. Build using zopen:
```bash
zopen build -vv
```

See the [zopen porting guide](https://zopen.community/#/Guides/Porting) for more details.

# Documentation

## Models and endianness

z/OS is big-endian. GGUF files published on Hugging Face are little-endian, so
their tensor data has to be swapped before it can be used.

This port does that automatically: `llama_model_loader` detects the mismatch and
byteswaps each tensor as it is read, so a stock little-endian GGUF loads and runs
correctly with no preparation. Two things follow from it:

  - the swap happens on every load, which makes loading a large model slower;
  - mmap is turned off for that model, because the mapping is read-only and
    backed by the file, so it cannot be swapped in place. A warning is logged.

If you load the same model repeatedly, convert it once to big-endian instead and
skip both costs:

```bash
python3 gguf-py/gguf/scripts/gguf_convert_endian.py model.gguf big
```

The conversion rewrites the file in place, so keep a backup. A model that is
already big-endian is loaded directly, with no swapping and with mmap available.

Run with `-v` to see which path was taken; the loader logs
`model endianness differs from the host, byteswapping tensor data` when it swaps.

## Telum Integrated Accelerator for AI (NNPA)

The zDNN backend uses the on-chip AI accelerator found on z16 (Telum I) and
later. Detection is entirely at run time, so a single binary runs on z15 and
below - the backend simply reports no devices there and llama.cpp schedules onto
CPU/BLAS instead.

Set `GGML_DISABLE_ZDNN=1` in the environment to turn the accelerator off on
hardware that has it, which is useful for A/B comparisons.

# Troubleshooting

While building if an error is encountered in the `ggml-cpu.cpp` file (perhaps related to pthread), run `zopen upgrade zoslib -y` and try building again.

# Contributing
Contributions are welcome! Please follow the [zopen contribution guidelines](https://github.com/zopencommunity/meta/blob/main/CONTRIBUTING.md).
