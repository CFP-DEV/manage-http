# manage-http
Manage your http fetch request with various functions and options.

## How to
### Basic Useage

```

let options = {
  requestURL: 'http://localhost:5000/users',
  method: 'POST',
  headers: [
    {
      key: "Content-type", 
      value: "application/json"
    }
  ],
  body: JSON.stringify({
    name: 'test',
    email: 'test',
    phone: 'test',
    address: 'test'
  }),
}

const request1 = new cfphttp(options);

// Initialize Request
request1.initRequest();

// Send Request
request1.sendRequest().then(response => response.json()).then(json => console.log(json));

```

### Manage Headers

```

// Append header
request1.appendHeader(key, value);

// Set header
request1.appendHeader(key, value);

// Remove header
request1.removeHeader(key);

```

### Manage Params

```

// Append param
request1.appendParam({key: '', value: ''});

// Set param
request1.setParam({key: '', value: ''});

// Remove param
request1.removeParam(key);

```

### Other

```

// Set URL
request1.appendParam(URL);

// Set Method
request1.setMethod('GET');

// Set body
request1.setBody(data);

```
