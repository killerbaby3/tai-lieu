#!/bin/bash
env=production
zone=hn
document_root=/data/www/public_restruct/vnexpress.net/server/Job
worker=reg_ca_2021.php
prog=reg_ca_2021.sh
num_prog=1
date=`date +"%Y-%m-%d"`
log_file=$document_root/logs/insert_ca2021_production-$date.log
#Start process
start() {
	echo "Starting $prog"
        APPLICATION_ENV=$env ZONE_ENV=$zone nohup  /build/phpV7/bin/php -c /build/phpV7/etc/php.ini  $document_root/$worker -v >> $log_file 2>&1 &
}

# Stop all process
stop() {
	echo "Stopping $prog"
	ps -ef | grep "$document_root/$worker" | grep -v grep | awk '{print$2}' | xargs kill -9
}
# Detect process
detect() {
	current_num_prog=`ps -ef | grep -v grep | grep -c "$document_root/$worker"`
	if [ "$current_num_prog" -lt "$num_prog" ]; then
		let new_prog=$num_prog-$current_num_prog
		i=1
		while [ $i -le $new_prog ]; do
			start
			let i++
		done
	fi
}
case "$1" in
	"start" )
           start
           ;;
	"stop" )
	   stop
           ;;
	"restart" )
	   stop
	   detect
           ;;
	"detect" )
           detect
           ;;
     	* )
           echo "Usage: $prog {start|stop|restart|detect)"
           exit 1
esac
usleep 500
ps -ef | grep -v grep | grep "$document_root/$worker"
exit 0
