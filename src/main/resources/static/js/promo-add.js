$("#linkPromocao").on('change', function() {
	var url = $(this).val();

	if (url.length > 7) {
		$.ajax({
			method: "POST",
			url: "/meta/info?url=" + url,
			cache: false,
			beforeSend: function() {
				$("#alert").removeClass("alert alert-danger").text("");
				$("#titulo").val("");
				$("#site").text("");
				$("#linkImagem").attr("src", "https://images.unsplash.com/photo-1577538928305-3807c3993047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
				$("#linkImagem").css("opacity","0.7");
				$("#loader-img").addClass("loader");
			},
			success: function(data) {
				console.log(data);
				$("#titulo").val(data.title);
				$("#site").text(data.site.replace("@", ""));
				$("#linkImagem").attr("src", data.image);
				
				
			},
			statusCode: {
				404: function() {
					$("#alert").addClass("alert alert-danger").text("Nenhuma informação pode ser recuperada dessa URL."),
					$("#linkImagem").attr("src", "https://i.pinimg.com/564x/be/61/b9/be61b994f3d4d062efac11a996ceac24.jpg"),
					$("#site").text("Error 404");
					
				}
			},

			error: function() {
				$("#alert").addClass("alert alert-danger").text("Ops... Algo deu errado. Tente verificar a url informada, ou tente novamente mais tarde"),
				$("#linkImagem").attr("src", "https://i.pinimg.com/564x/52/6a/7e/526a7e6462bc9f742a9b538bc7eb1f75.jpg"),
				$("#site").text("Error 500");
				
			},
			complete: function(){
				$("#loader-img").removeClass("loader");
				$("#linkImagem").css("opacity","1");
			}

		});
	}
});