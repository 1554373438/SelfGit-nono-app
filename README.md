## project setup
* init  

	~~~
	npm install && bower install
	~~~
* local run 

	~~~
	gulp serve
	~~~
* build 

	~~~
	gulp
	~~~

## codeing style  
* folder: `my-foler`  
* file: `my.file.extention`  
* class: `my-class`  
* id: `my_id`  
* attribute: `myAttr`  
* method: `myMethod`    
* controller: `MyController`  
* service: `MyService`  

## `nono-tabs` directive usage
> customize `type` attribute to change highlight/active style  

* basic 

~~~html
<ion-view>
	<ion-content>
		<nono-tabs type="positive">
			<nono-tab title="加息券">加息券blabla</nono-tab>
			<nono-tab title="特权本金">特权本金blabla</nono-tab>
			<nono-tab title="诺币">诺币blabla</nono-tab>
		</nono-tabs>
	</ion-content>
</ion-view>
~~~

* fixed on top  

~~~html
<ion-view>
	<nono-tabs type="positive" tabs-top="true">
		<nono-tab title="加息券">加息券blabla</nono-tab>
		<nono-tab title="特权本金">特权本金blabla</nono-tab>
		<nono-tab title="诺币">诺币blabla</nono-tab>
	</nono-tabs>
</ion-view>
~~~
> tabs's position is relative by default, add `tabs-top=true`  
> tab pane would be inside `<ion-content>`, so don't add `<ion-content>` again

* for status change, no tab pane

~~~html
<nono-tabs type="positive" ng-model="status">
  <nono-tab title="未支付" value="1"></nono-tab>
  <nono-tab title="待发货" value="2"></nono-tab>
  <nono-tab title="已收货" value="3"></nono-tab>
</nono-tabs>
~~~
> tab select will bind the tab value to ngModel (`status` in this example)