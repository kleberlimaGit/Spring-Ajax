//submit do formulario para o controller
$('#form-add-promo').submit(function(evt){
	//bloquear o comportamento padrao do submit
	evt.preventDefault();
	
	var promo = {};
	promo.linkPromocao = $("#linkPromocao").val();
	promo.descricao = $("#descricao").val();
	promo.preco = $("#preco").val();
	promo.categoria = $("#categoria").val();
	promo.titulo = $("#titulo").val();
	promo.linkImagem = $("#linkImagem").attr("src");
	promo.site = $("#site").text();
	
	console.log("promo > ", promo);
	
	$.ajax({
		method: "POST",
		url: "/promocao/save",
		data: promo,
		beforeSend: function(){
			$("#form-add-promo").hide();
			$("#loader-form").addClass("loader-G").show();
		
		},
		success:function(){
			//Limpar formulário após realizar um cadastro
			$("#form-add-promo").each(function(){
				this.reset();
			})
			$("#linkImagem").attr("src", "https://images.unsplash.com/photo-1577538928305-3807c3993047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
			$("#site").text("");
			
			//Mensagem de Sucesso apos fazer um cadastro 2seg depois a mensagem some
			$("#alert").addClass("alert alert-success").text("Promoção cadastrada com sucesso!!");
			
			$("#alert").fadeOut(3500,function(){
				$("#alert").removeClass("alert-success").text("");
				$("#alert").fadeIn(250)
			});
			
			/*setTimeout(function(){
				$("#alert").removeClass("alert-success").text("");
			},2000);*/
		},
		statusCode: {
			422: function(xhr) {
				console.log('status error', xhr.status);
				var errors = $.parseJSON(xhr.responseText);
				$.each(errors, function(key, val) {
					$("#" + key).addClass("is-invalid"); //adiciona borda vermelha
					$("#error-" + key)
						.addClass("invalid-feedback") //retorna texto vemelho
						.append("<span class= 'error-span'>"+ val + "</span>")
				});
			}
		},
		
		error: function(xhr){
			console.log("> error: ", xhr.responseText);
			$("#alert").addClass("alert alert-danger").text("Houve um erro! Promoção não pôde ser cadastrada. Por favor limpe o formulário e tente cadastrar novamente.");
//			
//			$(".form-control").each(function(){
//				$(".form-control").prop("disabled",true)
//			});
//			$("#btn").prop("disabled",true);
		},
		complete: function(){
			$("#loader-form").fadeOut(800,function(){
				$("#form-add-promo").fadeIn(250);
				$("#loader-form").removeClass("loader-G");
			});
		}
	
	});
});


//funcao apagar campos
$("#limpar").on('click',function(){
		$("#form-add-promo")[0].reset();
		$("#linkImagem").attr("src", "https://images.unsplash.com/photo-1577538928305-3807c3993047?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80");
		$("#alert").removeClass("alert alert-danger alert-success").text("");
		$("#site").text("");
		
		$(".form-control").each(function(){
			$(".form-control").prop("disabled",false)
			});
		$("#btn").prop("disabled",false);	
	});




//Funcao para capturar as meta tags
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