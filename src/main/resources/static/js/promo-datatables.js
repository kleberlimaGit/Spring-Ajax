$(document).ready(function(){
	moment.locale('pt-br');
	
	var table = $("#table-server").DataTable({
		processing: true,
		serverSide: true,
		responsive: true,
		lengthMenu: [10,15,20,25],
		language:  {
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
	

	
	$(".paginate_button").on('click', function(){
		if($(this).not('.current')){
			console.log("cliquei aqui")
			table.buttons().disable();
		}
	});
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

