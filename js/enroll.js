Parse.initialize("0BribHd5IKm0HZzApohYmyoUmqHCSyu8mwCtFdjq", "Fso20ksEgFz00wQwOyplBP8E5YnSY0fUQqHCkDNo");

$(document).ready(function () {
	$('#submit').click(function (e) {
		if ($('#name').val() === '') {
			e.preventDefault();
			alert("請輸入姓名");
		} else if ($('#department').val() === '') {
			e.preventDefault();
			alert("請輸入系級");
		} else if ($('#id').val() === '') {
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
								 
								 showOnTable(object, applicant);
							 } 
							 else { // 餘額不足
								 e.preventDefault();
								 alert('此場次餘額不足');
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

function showOnTable(session, applicant) {
	alert('show');
	var string = "#" + session.get("date") + session.get("time");
	alert(string);
	var applicants = session.get("applicants");
	$('#first_cell').append(applicants[1] + " " + session.get("applied") + "人");
}
