all: src/* frontend
	cargo build

prod: src/* frontend
	cargo build --release

docs: src/*
	cargo doc --no-deps

frontend: frontend/
	cd frontend && make

docker: Dockerfile
	docker build -t cw .

.PHONY: docker frontend docs
