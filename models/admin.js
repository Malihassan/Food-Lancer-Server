const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			minLength: [5, "Must be at least 5"],
			maxLength: [20, "Must be at latest 20"],
			trim: true,
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
			minLength: [3, "Must be at least 3"],
			maxLength: [20, "Must be at latest 20"],
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			minLength: [3, "Must be at least 3"],
			maxLength: [20, "Must be at latest 20"],
			required: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		phone: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			match: [/^01[0125]\d{1,8}/g, "Please fill a valid Phone Number"],
		},
		token: {
			type: String,
			default: "",
		},
		email: {
			type: String,
			trim: true,
			unique: true,
			required: true,
			lowercase: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Please fill a valid email address",
			],
		},
	},
	{ timestamps: true }
);

const AdminModel = mongoose.model("Admin", adminSchema);
module.exports = AdminModel;
