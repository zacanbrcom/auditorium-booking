FROM gitpod/workspace-full

USER root

RUN bash -cl "rustup toolchain install nightly && rustup default nightly"
