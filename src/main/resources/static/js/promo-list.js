var pageNumber = 0;

$(document).ready(function(){
	$("#loader-img").hide();
	$("#fim-btn").hide();
})

// efeito infine scroll

$(window).scroll(function(){

	var scrollTop = $(this).scrollTop();// retorna o valor do tamanho atual da barra de rolagem
	var conteudo = $(document).height() - $(window).height();
	
	//console.log('scrollTop: ', scrollTop, '|' , 'conteudo', conteudo, '|', 'window', $(window).height());
	
	if(scrollTop >= conteudo){
		pageNumber++;
		setTimeout(function(){
			loadByScrollBar(pageNumber);
		},200)
	}

});

function loadByScrollBar(pageNumber){

	$.ajax({
	
		method: "GET",
		url: "/promocao/list/ajax",
		data:{
			page: pageNumber
		},
		beforeSend: function(){
			$("#loader-img").show();
		},
		success: function(response){
			if(response.length > 150){
			$(".row").fadeIn(250, function(){
				$(this).append(response);
				})
			}else{
				$("#fim-btn").show();
				$("#loader-img").removeClass("loader")
			}


		},
		error: function(xhr){
			alert("Ops, Ocorreu um erro: " + xhr.status + "-" + xhr.statusText)
		},
		
		complete: function(){
			$("#loader-img").hide();
		}
	
	})
}


//Likes

