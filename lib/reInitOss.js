var appServer = window.location.host + '/yich/stsService';
var bucket = 'ngsimage';
var region = 'oss-cn-hangzhou';

var urllib = OSS.urllib;
var Buffer = OSS.Buffer;
var OSS = OSS.Wrapper;
var STS = OSS.STS;
var client;

var reInitOss = function() {
	var url = appServer;
	return urllib.request(url, {
        method: 'GET'
    }).then(function(result) {
       var creds = JSON.parse(result.data);
        client = new OSS({
            region: region,
            accessKeyId: creds.key,
            accessKeySecret: creds.secret,
            stsToken: creds.token,
            bucket: bucket
        });
       reInitOssInit(); 
    });
};
reInitOss();