build-image:
	docker build -t hmo-web .

clean:
	docker builder prune -f