//  正则方法
//  判断姓名
export function regName(val){
	let name = val.replace(/(^\s*)|(\s*$)/g, "");
	if (name.length == 0 || name.length > 10) {
		return false
	}else{
		return name
	}
}
//  判断3位数以内数字
export function regAge(val){
	val = val + ''
	let age = val.replace(/(^\s*)|(\s*$)/g, "")
	if (/^[1-9]\d{0,2}$/.test(age)) {
		return age
	}else{
		return false
	}
}
//  正则判断电话号码
export function regTelePhone(val){
	let phone = val.replace(/(^\s*)|(\s*$)/g, "")
	return /^1\d{10}$/.test(phone)
}

//  判断3位数以内数字或为空
export function heigAge(val){
	if (/^[1-9]\d{0,2}$/.test(val) || val == '') {
		return val
	}else{
		return false
	}
}
