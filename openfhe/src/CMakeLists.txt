
cmake_minimum_required(VERSION 3.15)
project(TemporalCurrencyOpenFHE)

find_package(OpenFHE REQUIRED)

add_executable(temporal_cipher temporal_cipher.cpp)
target_link_libraries(temporal_cipher OpenFHE::openfhe)