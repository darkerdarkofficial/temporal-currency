### How to build & run (Linux/macOS)

```
git clone https://github.com/openfheorg/openfhe-development.git
cd openfhe-development \&\& mkdir build \&\& cd build
cmake .. \&\& make -j8
sudo make install

cd ../../../temporal-currency/openfhe
mkdir build \&\& cd build
cmake .. \&\& make
./temporal\_cipher
# → produces temporal\_genesis.ct (upload to IPFS)
```

