'use strict';
/**
 * model
 */
export default class extends think.model.base {
	add(data) {
		let model = this.model("ct");

		return model.add(data);
	}
}