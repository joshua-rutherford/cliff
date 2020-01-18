/**
 * Copyright [yyyy] [name of copyright owner]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * 	http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const archiver = require('archiver');
const aws = require('aws-sdk');
const fs = require('fs');
const tmp = require('tmp');

// Writes a zip file with the contents of this project to a stream and invokes the callback when done.
function archive(stream, callback) {
	stream.on('close', callback)
	var archive = archiver('zip', { zlib: { level: 9 } })
	archive.pipe(stream)
	archive.directory('.', false)
	archive.finalize();
}

// Creates a temporary file and invokes the callback with the path.
function temporary(callback) {
	tmp.file(function (error, path, _, _) {
		if (error) { throw Error(error); }
		callback(path);
	});
}

// Uploads a file to S3 and invokes the callback when done.
function upload(stream, callback) {
	var s3 = new aws.S3({ accessKeyId: process.env.AWS_ACCESS_KEY, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });
	s3.upload({ Body: stream, Bucket: 'decipher-lambda-public', Key: 'cliff/cliff-' + version() + '.zip' }).send(callback);
}

// Reads the version from the VERSION file.
function version() {
	return fs.readFileSync('VERSION', 'utf8').trim();
}

temporary(function (path) {

	console.log("Generating archive...");

	var writer = fs.createWriteStream(path);
	archive(writer, function () {

		console.log("Uploading archive...");

		var reader = fs.createReadStream(path);
		upload(reader, function () {
			console.log("Complete");
		})
	})
});
