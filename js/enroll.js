Parse.initialize("0BribHd5IKm0HZzApohYmyoUmqHCSyu8mwCtFdjq", "Fso20ksEgFz00wQwOyplBP8E5YnSY0fUQqHCkDNo");

function showState(Session, i) {
	var tag = "#c" + i.toString();
	var query = new Parse.Query(Session);
	query.equalTo("tag", "c" + i.toString());
	query.first({
		success: function(object) {
					 var applied = object.get("applied");
					 if (applied >= 7) {
						 $(tag).text("已額滿");
					 }
					 else {
						 $(tag).html(" <a href=''>可預約<br>剩餘" + (7-applied).toString() + "位</a> ");
					 } 
				 },
		error: function(error) {
				   //alert("Error: " + error.code + " " + error.message);
			   }
	}); 
}

function loadTable() {
	var Session = Parse.Object.extend("Session");

	for (var i=1; i <= 133; ++i) {
		showState(Session, i);
	}
}

$(document).ready(function () {
	loadTable();
	$('#submit').click(function (e) {
		if ($('#name').val() === '') {
			e.preventDefault();
			alert("請輸入姓名");
		} else if ($('#department').val() === '') {
			e.preventDefault();
			alert("請輸入系級");
		} else if($('#id').val() === '') {
			e.preventDefault();
			alert("請輸入學號");
		} else if ($('#phone').val() === '') {
			e.preventDefault();
			alert("請輸入電話");
		} else if ($('#amount').val() === '' || Number($('#amount').val()) <= 0) {
			e.preventDefault();
			alert("請輸入人數");
		} else {
			var name = $('#name').val();
			var department = $('#department').val();
			var id = $('#id').val();
			var phone = $('#phone').val();
			var amount = Number($('#amount').val());
			var date = $('#dateSelect option:selected').text();
			var time = $('#timeSelect option:selected').text();
			var Session = Parse.Object.extend("Session");

			// 找對應的場次
			var query = new Parse.Query(Session);
			query.equalTo("date", date);
			query.equalTo("time", time);
			query.first({
				success: function(object) {
							 // Successfully retrieved the object.
							 var applied = object.get("applied");
							 if (applied+amount <= 7) { 
								 object.set("applied", applied+amount);
								 console.log(applied + '+' + amount + '=' + object.get("applied"));
								 var applicants = object.get("applicants");
								 applicants.push(name);
								 object.set("applicants", applicants);
								 object.save();

								 var Applicant = Parse.Object.extend("Applicant");
								 var applicant = new Applicant();
								 applicant.set("date", date);
								 applicant.set("time", time);
								 applicant.set("name", name);
								 applicant.set("department", department);
								 applicant.set("phone", phone);
								 applicant.set("isPaid", false);
								 applicant.save();

								 alert('預約成功!\n場次：' + date + ' ' + time + '\n' + name + ' 預約' + amount + '位');
								 window.location.reload();
							 } 
							 else { // 票券不足
								 alert('很抱歉\n此場次票券不足\n請選擇其他場次');
							 }
						 },
					error: function(error) {
							   e.preventDefault();
							   alert("Error: " + error.code + " " + error.message);
						   }
			});
		}
	});
});
