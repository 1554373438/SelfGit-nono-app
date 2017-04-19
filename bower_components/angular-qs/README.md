# angular-qs
Angular Module for [qs](https://github.com/ljharb/qs). This project is only an angular style wrapper base on `qs` v6.4.0.


## Usage

- install from bower

  ~~~shell
  bower install angular-qs --save
  ~~~

- include module `angular-qs`

- import `qs` service as dependency

  ~~~javascript
    angular.controller('test', ['qs', '$log', function(qs, $log) {
      var obj = qs.parse('a=c');

      var str = qs.stringify(obj);

      $log.info(str === 'a=c');
    }]);
  ~~~
  
  
### Parsing Objects
```javascript
qs.parse(string, [options]);
```

### Stringifying Objects
```javascript
qs.stringify(object, [options]);
```

### Options
Please refer to [qs](https://github.com/ljharb/qs) for the full options description.
