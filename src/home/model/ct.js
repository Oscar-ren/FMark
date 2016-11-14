'use strict';
/**
 * model
 */
export default class extends think.model.base {
	addMark(data) {
		let model = this.model("ct");

		return model.add(data);
	}
	getMarkbyId(id) {

	}
}