package com.mballem.demoajax.web.dwr;

import java.time.LocalDateTime;
import java.util.Calendar;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptSessions;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import org.directwebremoting.annotations.RemoteMethod;
import org.directwebremoting.annotations.RemoteProxy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.stereotype.Component;

import com.mballem.demoajax.repository.PromocaoRepository;

@Component
@RemoteProxy
public class DWRAlertPromocoes {
	@Autowired
	private PromocaoRepository repository;
	
	private Timer timer;
	
	
	private LocalDateTime getDtCadastroByUltimaPromocao() {
		PageRequest pageRequest = PageRequest.of(0, 1, Direction.DESC, "dtCadastro");
		return repository.findUltimaDataDePromocao(pageRequest)
						 .getContent()
						 .get(0);
	}

	
	
	
	// sincronizado pq usa o thred 
	@RemoteMethod // fazer configuracao de relacao entre o metodo init servidor / client
	public synchronized void init() {
		System.out.println("DWR está ativado!");
		
		LocalDateTime lastDate = getDtCadastroByUltimaPromocao();
		
		WebContext context = WebContextFactory.get();
		
		timer = new Timer();											//60000: tempo em milisec para a pagina ta se atualizando sozinha		
		timer.schedule(new AlertTask(context,  lastDate), 10000, 60000 ); // 1000 : tempo em milisec para mostrar uma nova atualizaçao
											
	}
	
	class AlertTask extends TimerTask{
		private WebContext context;
		private LocalDateTime lastDate;
		private long count;
		
		
		
		public AlertTask(WebContext context, LocalDateTime lastDate) {
			super();
			this.context = context;
			this.lastDate = lastDate;
		}



		@Override
		public void run() {
			String session = context.getScriptSession().getId();
			
			Browser.withSession(context, session, new Runnable() {
				
				@Override
				public void run() {
					
					Map<String, Object> map = repository.totalAndUltimaPromocaoByDataCadastro(lastDate);
					
					count = (long) map.get("count");
					lastDate = map.get("lastDate") == null ? lastDate : (LocalDateTime) map.get("lastDate");
					
					Calendar time = Calendar.getInstance();
					time.setTimeInMillis(context.getScriptSession().getLastAccessedTime());
					System.out.println("count: "+ count + ", lastDate: " + lastDate + "<" + session + "> " + " <" + time.getTime() + ">");
					
					if(count > 0) {
						ScriptSessions.addFunctionCall("showButton", count);
					}
					
				}
				
			});


		}
		
	}
	
}
