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

const newman = require('newman');

exports.handler = async function (event) {
	return new Promise(function (resolve, reject) {
		newman.run({ collection: JSON.parse(event.body) }, function (error, summary) {
			error ? reject(Error(error)) : resolve({ body: JSON.stringify(summary) });
		});
	});
}
