# ---- Stage 1: Build ----
FROM ubuntu:22.04 AS builder

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential cmake git libasio-dev libsqlite3-dev curl wget && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy your project files (excluding build, thanks to .dockerignore)
COPY . .


# Clone Crow (header-only) if not already present
RUN mkdir -p include && \
    if [ ! -f include/crow.h ]; then \
        git clone https://github.com/CrowCpp/crow.git /tmp/crow && \
        cp /tmp/crow/include/crow.h include/ && \
        cp -r /tmp/crow/include/crow include/; \
    fi

# Configure and build
RUN rm -rf build && mkdir build && cd build && cmake .. && make -j$(nproc)

# ---- Stage 2: Runtime ----
FROM ubuntu:22.04

RUN apt-get update && apt-get install -y libsqlite3-0 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy compiled binary
COPY --from=builder /app/build/crow_sqlite_crud /app/crow_sqlite_crud

# Persistent data directory
RUN mkdir -p /app/data

EXPOSE 8080

CMD ["./crow_sqlite_crud"]

