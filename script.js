	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {

		// получаем настройки
		chrome.storage.sync.get(null,function (options) {


			if (options['fontsize'] && options['linksbox']){
	        	document.getElementById('main').style.fontSize = options['fontsize'];
	        	document.getElementById('linksbox').innerHTML = options['linksbox'];

	        	replace_main();

	        } else {
	        	store_default();
	        }

	    });


		var url = tabs[0].url;
	    var title = tabs[0].title;


	    // получаем домен
	    var a      = document.createElement('a');
        a.href = url;
        var domen = a.hostname;
        domen = domen.replace('www.','');

        // обновляем в коде
        function replace_main(){
		    var main = document.getElementById('main');
		    var str = main.innerHTML;
		    str = str.replace(/{domen}/g, domen);
		    str = str.replace(/{url}/g, url);
		    str = str.replace(/{title}/g, title);
		    main.innerHTML = str;
		}

		// яндекс тиц
		get_url( "http://bar-navig.yandex.ru/u?url=http://"+domen+"&show=1", yandex_tic);

		function yandex_tic (str){
			var found = str.match(/tcy rang="([0-9]*)" value="([0-9]*)"/);
		  	var yandex_tic = found[2];
		  	if (found[2]==0 && found[1]==1) yandex_tic='<font color="red">АГС</font>';
		  	document.getElementById('yandex_tic').innerHTML = yandex_tic;	
		}
		

		// яндекс индекс через выдачу
		get_url( "https://yandex.ru/search/?text=site:" + domen, yandex_index);
		function yandex_index(str){

			//var found = str.match(/нашлось (.*) ответов/);
			var found = str.match(/"found":"(.+?)ответ/);
			if (found){
				var yandex_index = found[1];
				yandex_index  = yandex_index.replace('—\\n','');
				yandex_index  = yandex_index.replace('тыс.','000');
				yandex_index  = yandex_index.replace('млн','000000');
				yandex_index  = yandex_index.replace(/[^\/\d]/g,'');
			}	

			if (str.match(/ничего не нашлось/)){
				var yandex_index = 0;
			}

			document.getElementById('yandex_index').innerHTML = yandex_index;	
		}

		// google индекс через выдачу
		get_url( "https://www.google.ru/search?q=site:" + domen, google_index);
		function google_index(str){
			
			var found = str.match(/примерно (.+?)</);
			if (found){
				var google_index = found[1];
				google_index  = google_index.replace(/[^\/\d]/g,'');
			}

			if (str.match(/ничего не найдено/)){
				var google_index = 0;
			}

			document.getElementById('google_index').innerHTML = google_index;	
		}

		// информация о сервере
		get_url( "http://amserver.ru/amextension.php?domen=" + domen, site_info);

		function site_info(str){
			var info = JSON.parse(str);
			document.getElementById('site_ip').innerHTML = "<a target='_blank' href='https://www.reg.ru/whois/?dname="+info['ip']+"'>"+info['ip']+"</a> <small>["+info['host']+"]</small>";	
		}


	});


	function get_url(url,callfunc){

		var xhr = new XMLHttpRequest();
		xhr.open("GET", url, true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		  	callfunc(xhr.responseText);		    
		  }
		}
		xhr.send();

	}


	function store_default(){

		chrome.storage.sync.set({
		    fontsize: 16,
		    linksbox: document.getElementById('linksbox').innerHTML.trim()
		  }, function() { document.getElementById('main').innerHTML = "<b>Привет, вебмастер!</b><br><br><img height='64' align='left' src='https://cdn4.iconfinder.com/data/icons/general10/png/128/wizard.png'>Спасибо за проявленный интерес к расширернию 'SeoMagic'.<br><br>Расширение установлено и готово к работе!<br><br>Если захотите что-то изменить - перейдите в раздел <a target='_blank' href='/options.html'>настройки</a>.<br><br>   <a href='/popup.html'>Приступить к работе >>></a>"; }
		 );

	}




