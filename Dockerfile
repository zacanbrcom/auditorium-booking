FROM archlinux/base

# dependencies
RUN pacman -Suy --noconfirm rustup make gcc pkgconf yarn
RUN rustup install nightly

# workdir
WORKDIR /cw

# copy to workdir
COPY . .

# build
RUN make

# expose ports
EXPOSE 8000

# run cmd
CMD ["cargo", "run", "--release"]
