build:
	docker build -t ${tag} .
clean:
	docker rmi -f ${tag}
run-docker:
	docker run -d -p ${port}:${port} --name ${name} ${tag}
run-docker-compose:
	docker-compose up -d 
deploy-backend:
	rsync -avhzL --delete \
				--no-perms --no-owner --no-group \
				--exclude .git \
				--exclude .env \
				--exclude dist \
				--exclude src/uploads \
				--exclude node_modules \
				--filter=":- .gitignore" \
				. ubuntu@ip:/home/ubuntu/triangle-arbitrage
	ssh ubuntu@ip "source ~/.nvm/nvm.sh && pm2 restart Backend"
create-pm2-backend:
	cd /home/ubuntu/triangle-arbitrage && pm2 start "npm run start" --name=Backend