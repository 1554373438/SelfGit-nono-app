# img-http-src
Set placeholder image path(if there is), then fetch image using `$http` service, set image path again when http response success.



## usage
- install from bower  

	~~~shell
	bower install img-http-src --save
	~~~
- include module `imgHttpSrc`
- directive usage in html
	
	>$http
	
	~~~javascript
	<img http-src="imgPath" placeholder="phPath" alt="img">
	~~~
	>dataUrl
	
	~~~javascript
	<img dataurl-src="imgPath" placeholder="phPath" alt="img">
	~~~
