class cfphttp {
  constructor(props = {}) {
    this._requestURL = props.requestURL || null;
    this._requestParams = props.requestParams || [];
    this._method = props.method || 'GET';
    this._headers = props.headers || [];
    this._body = props.body || null;
  }

  validate() {
    // Check if requestURL is set.
    if (!this._requestURL)
      throw '[Manage HTTP] Request URL is required.';

    if (!this.validateMethod(this._method))
      throw '[Manage HTTP] Invalid method.'
  }

  /**
   * @description
   * Check if method is valid according to this document:
   * https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
   * 
   * @param {string} method 
   */
  validateMethod(method) {
    switch (method) {
      case 'GET': return true;
      case 'HEAD': return true;
      case 'POST': return true;
      case 'PUT': return true;
      case 'DELETE': return true;
      case 'OPTIONS': return true;
      case 'PATCH': return true;
      default: return false;
    }
  }

  /**
   * @description
   * Initialize request with given params. You can still cutomize it through functions before sending.
   */
  initRequest() {
    // Check if there are any headers
    this.headers = new Headers();

    if (this._headers.length !== 0) {
      for (let i = 0; i < this._headers.length; i++) {
        this.appendHeader(this._headers[i].key, this._headers[i].value);
      }
    }

    // Check if there is body set
    if (this._body) {
      this.setBody(this._body);
    }
  }

  /**
   * @description
   * Set method of the request.
   * 
   * @param {string} method 
   * @returns {bool}
   */
  setMethod(method) {
    this._method = method;

    return this._method !== method ? false : true;
  }

  /**
   * @description
   * Set requestURL.
   * 
   * @param {string} requestURL 
   * @returns {bool}
   */
  setRequestURL(requestURL) {
    this.requestURL = requestURL;

    return this.requestURL === requestURL ? true : false;
  }

  /**
   * @description
   * Update param if its already exists or creates new one if it doesn't.
   * 
   * @param {object} param
   * @returns {bool} 
   */
  setParam(param) {
    if (typeof param !== 'object') {
      if (!param.key || !param.value)
        return false;
    }

    let updatedParams = [];
    let isUpdated = false;

    this._requestParams.forEach((requestparam, index) => {
      if (requestparam.key === param.key) {
        updatedParams.push(param);
        isUpdated = true;
      } else {
        updatedParams.push(requestparam);
      }
    });

    if (!isUpdated) {
      updatedParams.push(param);
    }

    this._requestParams = updatedParams;

    return true;
  }

  /**
   * @description
   * Append param to the URL.
   * 
   * @param {object} param 
   * @returns {bool}
   */
  appendParam(param) {
    if (typeof param !== 'object') {
      if (!param.key || !param.value)
        return false;
    }

    this._requestParams.push(param);

    return true;
  }

  /**
   * @description
   * Removes param from the URL.
   * 
   * @param {string} key
   * @returns {bool}
   */
  removeParam(key) {
    let updatedParams = this._requestParams.filter(requestparam => requestparam.key !== key);

    if (this._requestParams.length === updatedParams.length) {
      return false;
    }

    this._requestParams = updatedParams;

    return true;
  }

  /**
   * @description
   * Append new header
   * 
   * @param {string} key 
   * @param {string} value 
   * @returns {bool}
   */
  appendHeader(key, value) {
    this.headers.append(key, value);

    // Check if it's added
    this.headers.get(key) == value ? true : false;
  }

  /**
   * @description
   * Set header. It will create new one if it doesn't exist or change one that is already existing.
   * 
   * @param {string} key 
   * @param {string} value 
   * @returns {bool}
   */
  setHeader(key, value) {
    this.headers.set(key, value);

    // Check if it's added
    return this.headers.get(key) == value ? true : false;
  }


  /**
   * @description
   * Delete header.
   * 
   * @param {string} key 
   * @returns {bool}
   */
  removeHeader(key) {
    this.headers.delete(key);

    return this.headers.get(key) ? false : true;
  }

  /**
   * @description
   * Set body of the request.
   * 
   * @param {object} data 
   * @returns {bool}
   */
  setBody(data) {
    // Checks if data can be set
    if (this._method === 'GET' || this._method === 'HEAD') {
      console.log('[Manage HTTP] This method doesn\'t accept body.');
      return false;
    }

    // Set body
    this.body = data;

    return true;
  }

  /**
   * @description
   * Sends fetch request.
   * 
   * @returns {function}
   */
  sendRequest() {
    // Validate
    this.validate();

    // Set Request URL
    this.setRequestURL(this._requestURL);

    // Check if there are any params
    if (this._requestParams.length !== 0) {
      this.requestURL += '?';

      // Loop through params and add them to the requestURL
      for (let i = 0; i < this._requestParams.length; i++) {
        this.requestURL += `${this._requestParams[i].key}=${this._requestParams[i].value}`;

        // Add '&' sign if it's not a last param
        if (i !== this._requestParams.length - 1)
          this.requestURL += '&';
      }
    }

    let options = {
      method: this._method,
    };

    // Set up options
    if (this.headers) {
      options.headers = this.headers;
    }

    if (this._method !== 'GET' || this._method === 'HEAD') {
      if (this.body) {
        options.body = this.body;
      }
    }

    // Send Request
    return fetch(this.requestURL, options);
  }
}