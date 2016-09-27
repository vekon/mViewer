
import $ from 'jquery';

var path = '../services/';

function setupServicePath() {
    // if (ENV && ENV != 'prod') {
      path = 'http://localhost:8080/mViewer/services/';
    // }
}

setupServicePath();

function service(typex, serviceName, req) {
	return $.ajax({
    type: typex,
    cache: false,
    dataType: 'json',
    headers: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    crossDomain: true,
    url: path + serviceName,
    data : req
  });
}

export default service;
