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

# Troubleshooting

While building if an error is encountered in the `ggml-cpu.cpp` file (perhaps related to pthread), run `zopen upgrade zoslib -y` and try building again.

# Contributing
Contributions are welcome! Please follow the [zopen contribution guidelines](https://github.com/zopencommunity/meta/blob/main/CONTRIBUTING.md).
