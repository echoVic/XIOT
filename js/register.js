// 个人注册：邮箱输入验证正确时，恢复发送验证码的button
document.getElementById("email").oninput = function() {
	myFunction()
};

function myFunction() {
	var a = document.getElementById("email").value
		// console.log(a);
	if(a.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
		$(".mkey-btn").removeAttr("disabled");
	} else {
		$(".mkey-btn").attr("disabled", true);
	}
}

// 企业注册：邮箱输入验证正确时，恢复发送验证码的button
document.getElementById("contactemail").oninput = function() {
	myFunction()
};

function myFunction() {
	var a = document.getElementById("contactemail").value;
	if(a.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
		$(".mkey-btn").removeAttr("disabled");
	} else {
		$(".mkey-btn").attr("disabled", true);
	}
}
$(document).ready(function() {
	
	// 以下是个人注册
	// 刷新图片验证码
	$(".photokey").click(function() {
		$.ajax({
			type: "get",
			url: "user/getCode",
			async: true,
			success: function(data) {
				var timestamp = new Date().getTime();
				$(".photokey").attr("src", "http://localhost:8080/Xiot/user/getCode" + '?' + timestamp);
			}
		});
	})

	// 发送邮箱验证码，同时验证图片验证码，成功则发送
	$("#mkeybtn").click(function() {
		var mailkey = {
			email: $(".text-email").val().trim(),
			imageCode: $("#textpkey").val().trim()
		}
		$.ajax({
			type: "post",
			url: "user/sendAuthCode",
			async: true,
			data: mailkey,
			dataType: 'json',
			success: function(data) {
				if(data.status == "FAIL") {
					$.ajax({
						type: "get",
						url: "user/getCode",
						async: true,
						success: function(data) {
							var timestamp = new Date().getTime();
							$(".photokey").attr("src", "http://localhost:8080/Xiot/user/getCode" + '?' + timestamp);
						}
					});
					if(data.code == 504) {
						$(".email-info").html("邮箱已注册！");
						$("#email").focus();
						return false;
					}
					if(data.code == 515) {
						$(".pkey-info").html("图片验证码错误！");
						$("#textpkey").focus();
						return false;
					}
				}
				$(".email-info").html("");
				$(".pkey-info").html("");
				$(".mkey-info").html("验证码已发送至邮箱，请查收！");
			}
		});
	})

	//  输入框格式验证，并与后台注册交互
	$("#register-btn").click(function() {

		fr = document.forms[0];
		var user_value = fr.user.value.trim();
		var pwd_value = fr.passwd.value.trim();
		var email_value = fr.email.value.trim();
		var pkey_value = fr.pkey.value.trim();
		var mkey_value = fr.mkey.value.trim();
		var address = $("#s_city option:selected").val() + $("#s_province option:selected").val() + $("#s_county option:selected").val()

		if(user_value == "") {
			$(".user-info").html("请输入用户名！");
			fr.user.focus();
			return false;
		} else if(!(user_value.match(/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/))) {
			$(".user-info").html("用户名长度为3-16位，由数字、字母、下划线或中文组成！");
			fr.user.focus();
			return false;
		} else {
			$(".user-info").html("");
		}

		if(pwd_value == "") {
			$(".passwd-info").html("密码不能为空！");
			fr.passwd.focus();
			return false;
		} else {
			$(".passwd-info").html("");
		}

		if(fr.passwd.value != fr.passwd2.value) {
			$(".passwd2-info").html("两次输入的密码不一致！");
			fr.passwd2.focus();
			return false;
		} else {
			$(".passwd2-info").html("");
		}

		if(email_value == "") {
			$(".email-info").html("邮箱不能为空，将用于接收验证码！");
			fr.email.focus();
			return false;
		} else if(!(email_value.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/))) {
			$(".email-info").html("请输入正确的邮箱格式！");
			fr.email.focus();
			return false;
		} else {
			$(".email-info").html("");
		}

		if(pkey_value == "") {
			$(".pkey-info").html("验证码不能为空！");
			fr.pkey.focus();
			return false;
		} else {
			$(".pkey-info").html("");
		}

		if(mkey_value == "") {
			$(".mkey-info").html("验证码不能为空！");
			fr.mkey.focus();
			return false;
		} else {
			$(".mkey-info").html("");
		}

		var register = {
			userName: user_value,
			password: pwd_value1,
			email: email_value,
			authCode: mkey_value,
			address: address
		};
		//调用AJAX 
		$.ajax({
			async: false,
			type: "POST",
			url: "user/userRegister",
			data: register,
			dataType: 'json',
			success: function(data) {
				if(data.status == "FAIL") {
					if(data.code == 504) {
						$(".user-info").html("用户已存在！");
						fr.user.focus();
						return false;
					}
					if(data.code == 505) {
						$(".mkey-info").html("验证码错误，请重新输入！");
						fr.mkey.focus();
						return false;
					}
					return false;
				}
				window.location.href = "login.html";
			}
		});
	});

	// 输入框绑定enter键
	$(":input").bind('keypress', function(event) {
		if(event.keyCode == "13") {
			$(".check-account").click();
		}
	});

	//  以下是企业注册
	
	$("#comkeybtn").click(function() {
		var co_mailkey = {
			email: $(".text-contactemail").val().trim(),
			imageCode: $("#cotextpkey").val().trim()
		}
		$.ajax({
			type: "post",
			url: "user/sendAuthCode",
			async: true,
			data: co_mailkey,
			dataType: 'json',
			success: function(data) {
				if(data.status == "FAIL") {
					$.ajax({
						type: "get",
						url: "user/getCode",
						async: true,
						success: function(data) {
							var timestamp = new Date().getTime();
							$(".photokey").attr("src", "http://localhost:8080/Xiot/user/getCode" + '?' + timestamp);
						}
					});
					if(data.code == 504) {
						$(".contactemail-info").html("邮箱已注册！")
						$("#contactemail").focus();
						return false;
					}
					if(data.code == 515) {
						$(".co-pkey-info").html("图片验证码错误！");
						$("#cotextpkey").focus();
						return false;
					}
				}
				$(".contactemail-info").html("");
				$(".co-pkey-info").html("");
				$(".co-mkey-info").html("验证码已发送至邮箱，请查收！");
			}
		});
	})
	
	//  输入框格式验证，并与后台注册交互
	$("#co-register-btn").click(function() {
	
		fr1 = document.forms[1];
		var user_value1 = fr1.couser.value.trim();
		var pwd_value1 = fr1.copasswd.value.trim();
		var coname_value = fr1.coname.value.trim();
		var fulla_value = fr1.fulladdress.value.trim();
		var contact_value = fr1.contact.value.trim();
		var dep_value = fr1.department.value.trim();
		var contel_value = fr1.contacttel.value.trim();
		var email_value1 = fr1.contactemail.value.trim();
		var pkey_value1 = fr1.copkey.value.trim();
		var mkey_value1 = fr1.comkey.value.trim();
		var co_province = $("#s1_province option:selected").val();
		var co_city = $("#s1_city option:selected").val();
		var co_county = $("#s1_county option:selected").val();
		var address_value = co_province + '-' + co_city + '-' + co_county;
		var industry_value = $("#industry option:selected").text();
		var address = address_value + ' ' + fulla_value;
	
		console.log(address);
	
		if(user_value1 == "") {
			$(".co-user-info").html("请输入用户名！");
			fr1.couser.focus();
			return false;
		} else if(!(user_value1.match(/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,16}$/))) {
			$(".co-user-info").html("用户名长度为3-16位，由数字、字母、下划线或中文组成！");
			fr1.couser.focus();
			return false;
		} else {
			$(".co-user-info").html("");
		}
	
		if(pwd_value1 == "") {
			$(".co-passwd-info").html("密码不能为空！");
			fr1.copasswd.focus();
			return false;
		} else {
			$(".co-passwd-info").html("");
		}
	
		if(fr1.copasswd.value != fr1.copasswd2.value) {
			$(".co-passwd2-info").html("两次输入的密码不一致！");
			fr1.copasswd2.focus();
			return false;
		} else {
			$(".co-passwd2-info").html("");
		}
	
		if(coname_value == "") {
			$(".co-name-info").html("企业名称不能为空！")
			fr1.coname.focus();
			return false;
		} else {
			$(".co-name-info").html("");
		}
	
		if((co_province == "省份") || (co_city == "地级市") || (co_county == "区、县")) {
			$(".co-location-info").html("请选择企业所在地！");
			$("#s1_province").focus();
			return false;
		} else {
			$(".co-location-info").html("");
		}
	
		if(fulla_value.length < 5) {
			$(".fulladdress-info").html("详细地址不能少于5个字！");
			fr1.fulladdress.focus();
			return false;
		} else {
			$(".fulladdress-info").html("");
		}
	
		if(email_value1 == "") {
			$(".contactemail-info").html("邮箱不能为空，将用于接收验证码！");
			fr1.contactemail.focus();
			return false;
		} else if(!(email_value1.match(/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/))) {
			$(".contactemail-info").html("请输入正确的邮箱格式！");
			fr1.contactemail.focus();
			return false;
		} else {
			$(".contactemail-info").html("");
		}
	
		if(pkey_value1 == "") {
			$(".co-pkey-info").html("验证码不能为空！");
			fr1.copkey.focus();
			return false;
		} else {
			$(".co-pkey-info").html("");
		}
	
		if(mkey_value1 == "") {
			$(".co-mkey-info").html("验证码不能为空！");
			fr1.comkey.focus();
			return false;
		} else {
			$(".co-mkey-info").html("");
		}
	
		var co_register = {
			userName: user_value1,
			password: pwd_value1,
			companyName: coname_value,
			address: address,
			industry: industry_value,
			contacts: contact_value,
			department: dep_value,
			telphone: contel_value,
			email: email_value1,
			authCode: mkey_value1,
	
		};
		//调用AJAX 
		$.ajax({
			async: false,
			type: "POST",
			url: "user/companyRegister",
			data: co_register,
			dataType: 'json',
			success: function(data) {
				if(data.status == "FAIL") {
					if(data.code == 504) {
						$(".co-user-info").html("用户已存在！");
						fr1.couser.focus();
						return false;
					}
					if(data.code == 505) {
						$(".co-mkey-info").html("验证码错误，请重新输入！");
						fr1.comkey.focus();
						return false;
					}
					return false;
				}
	
				window.location.href = "login.html";
			}
		});
	});
});