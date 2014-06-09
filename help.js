/*
help.js
*/
var Help = {
	logger: Logger.create("Help.js", "help"),
	register: function(domEl, helpText) {
		$(domEl).attr('help-rq', 'true')
			.attr('help-text', helpText);
		return Help.refresh();//allow chaining
	},
	unregister: function(element) {
		$(element).attr('help-rq', 'false').off('mouseover mouseout');
		return Help;
	},
	refresh: function() {
		$('[help-rq="true"]').off('mouseover mouseout').unbind('mouseover mouseout')
			.bind('mouseover', function(ev) {
				Help.logger.log(ev, false);
				Help.help(ev.currentTarget);
			}).bind('mouseout', function(ev) {
				Help.logger.log(ev, false);//log without prefix
				if($(ev.currentTarget).attr('help-active')=='true') {
					$('#help-div').hide();
					$(ev.currentTarget).attr('help-active', 'false');
				}
			});
		return Help;
	},
	help: function(domEl) {
		if($(domEl).attr('help-rq')=='false'){
			//it was disabled
			Help.unregister(domEl);
			return self;
		}
		$('#help-div').show()
			.html($(domEl).attr('help-text'))
			//.css('left', 'auto')
			.css('right', ($(window).width()-295)+'px')
			.css('top', $(domEl).offset().top /*+ 65*/ + 'px');
		$(domEl).attr('help-active', 'true');
		if(ISSET($(domEl).attr('help-color'))){
			$('#help-div').css('background-color', $(domEl).attr('help-color'));
		}
		return Help;
	},
	setColor: function(domEl, color) {
		$(domEl).attr('help-color', color);
	}
};