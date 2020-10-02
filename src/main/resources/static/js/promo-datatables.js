

$(document).ready(function(){
	moment.locale('pt-br');
	var table = $("#table-server").DataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		lengthMenu: [10,15,20,25],
		 language: {
			search: "Pesquisar: ",
			info: "Mostrando _START_ até _END_ de _TOTAL_ registros",
			infoEmpty: "Mostrando 0 até 0 de 0 registros",
		    paginate: {
		           first: "Fsairst",
		           last: "Laasst",
		           next: "Próxima",
		           previous: "Anterior"
		       }
			},
		ajax: {
			url: "/promocao/datatables/server",
			data: "data"
		},
		columns: [
			{data: 'id'},
			{data: 'titulo'},
			{data: 'site'},
			{data: 'linkPromocao'},
			{data: 'descricao'},
			{data: 'linkImagem'},					//esta funcao abaixao serve para formatatar a moeda em um DataTable		
			{data: 'preco', render: $.fn.dataTable.render.number('.', ',' , 2 , 'R$ ')},// 1º e º2 P um replace 3ºP qtd de casas decimais 4º P moeda desejada
			{data: 'likes'},
			{data: 'dtCadastro', render: 
				function(dtCadastro) {
				return moment(dtCadastro).format('LL');
			}
			},
			{data: 'categoria.titulo'},
		],
		dom: 'Bfrtip',
		buttons: [
			{
				text: 'Editar',
				attr: {
					id: 'btn-editar',
					type: 'button'
				},
				enabled:false
			},
			
			{
				text: 'Deletar',
				attr: {
					id:'btn-excluir',
					type: 'button'
				},
				enabled:false
			}
		]
		
	});
	
	 //acao do botao editar
	$("#btn-editar").on('click', function(){		
		if(isSelectedRow()){
			var id = getPromoId();
			$.ajax({
				method: "GET",
				url: "/promocao/edit/" + id,
				beforeSend: function(){
					$("#modal-form").modal('show');
				},
				success: function( data ){
					$("#edt_id").val(data.id);
					$("#edt_site").text(data.site);
					$("#edt_titulo").val(data.titulo);
					$("#edt_descricao").val(data.descricao);
					$("#edt_preco").val(data.preco.toLocaleString('pt-BR',{
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					}));
					$("#edt_categoria").val(data.categoria.id);
					$("#edt_linkImagem").val(data.linkImagem);
					$("#edt_imagem").attr('src', data.linkImagem);
				},
				error: function(){
					alert('Ops... algum erro ocorreu, tente novamente')
				}
			});
			$("#modal-form").modal('show');
		}
	});
	
	// submit do formulario para editar
	$("#btn-edit-modal").on('click', function(){
		var promo = {};
		promo.descricao = $("#edt_descricao").val();
		promo.preco = $("#edt_preco").val();
		promo.categoria = $("#edt_categoria").val();
		promo.titulo = $("#edt_titulo").val();
		promo.linkImagem = $("#edt_linkImagem").val()
		promo.id = $("#edt_id").val();
		
		$.ajax({
			method: "POST",
			url: "/promocao/edit",
			data: promo,
			beforeSend: function(){
				
				// removendo as mensagens
				$("span").closest('.error-span').remove();
				
				//remover as bordas vermelhas
				$(".is-invalid").removeClass("is-invalid");
			
			
			},
			
			success: function(){
				$("#modal-form").modal("hide");
				table.ajax.reload(null,false); // apos fazer um upload em uma linha é necessario fazer um reload para atualiar as linhas. 	
			},
			statusCode: {
				422: function(xhr) {
					console.log('status error', xhr.status);
					var errors = $.parseJSON(xhr.responseText);
					$.each(errors, function(key, val) {
						$("#edt_" + key).addClass("is-invalid"); //adiciona borda vermelha
						$("#error-" + key)
							.addClass("invalid-feedback") //retorna texto vemelho
							.append("<span class= 'error-span'>"+ val + "</span>")
					});
				}
			}
			
		});
	});
	
	// alterar a imagem no componente <img> do modal
	
	$("#edt_linkImagem").on("change", function(){
		var link = $(this).val();
		$("#edt_imagem").attr("src", link);
	});
	
	
	// acao do botao excluir (abrir modal)
	$("#btn-excluir").on('click',function(){
		if(isSelectedRow()){
			$("#modal-delete").modal('show');
			var id = getPromoId();

		}

	});
	
	// exclusao de uma promocao 
	$('#btn-del-modal').on('click', function(){
		var id = getPromoId();
		$.ajax({
			method: "GET",
			url: "/promocao/delete/" + id,
			success: function(){
				$("#modal-delete").modal('hide');
				table.ajax.reload();
			},
			error: function(){
				alert("Ops.. Ocorreu um erro, tente mais tarde.");
			}
			
		})
	});
	
	function getPromoId(){
		return table.row(table.$('tr.selected')).data().id
	}
	
	function isSelectedRow(){
		var trow = table.row(table.$('tr.selected'));
		return trow.data()!== undefined
	}
	
	
	
	// habilidar e desabilitar buttons ao clicar nos botoes de avançar
	$("#table-server_paginate").on('click', 'a', function(){
		if(!$(this).hasClass('current') && !$(this).hasClass('disabled')){
			table.buttons().disable();
		}
		
	})
	
	// desmarcar e marcar butons ao clicar na ordenaçao
	$("#table-server thead").on('click', 'tr',function(){
	    	table.buttons().disable();
	});
	
	$("#table-server tbody").on('click', 'tr',function(){
		if($(this).hasClass('selected')){
	    	$(this).removeClass('selected');
	    	table.buttons().disable();
	    	
		} else {
			$('tr.selected').removeClass('selected');
			$(this).addClass('selected');
			table.buttons().enable();
		}
	});
	
	$("#btn-editar").on('click', function(){
		console.log("cliquei no editar")
	});

	$("#btn-excluir").on('click', function(){
		console.log("cliquei no deletar")
	});
	
	
});

