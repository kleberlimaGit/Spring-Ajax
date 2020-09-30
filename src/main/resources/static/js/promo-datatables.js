// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Statements/import

$(document).ready(function(){
	moment.locale('pt-br');
	
	var table = $("#table-server").DataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		lengthMenu: [10,15,20,25],
		 language:  {
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
	
	// acao do botao editar
	$("#btn-editar").on('click', function(){		
		if(isSelectedRow()){
			$("#modal-form").modal('show');
			var id = getPromoId();
		}
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

