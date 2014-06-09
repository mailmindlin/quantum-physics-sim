/*
help.js
*/
var Help = {
	logger: Logger.create("Help.js", "help"),
	register: function(domEl, helpText) {
		$(domEl).attr('help-rq', 'true')
			.attr('help-text', helpText);
		Help.refresh();
	},
	unregister: function(element) {
		$(element).attr('help-rq', 'false');
	},
	refresh: function() {
		$('[help-rq="true"]').off('mouseover mouseout').unbind('mouseover mouseout')
			.bind('mouseover', function(ev) {
				Help.logger.log(ev);
				Help.help(ev.currentTarget);
			}).bind('mouseout', function(ev) {
				Help.logger.log(ev);
				if($(ev.currentTarget).attr('help-active')=='true') {
					$('#help-div').hide();
					$(ev.currentTarget).attr('help-active', false);
				}
			});
	},
	help: function(domEl) {
		$('#help-div').show()
			.html($(domEl).attr('help-text'))
			.attr('help-active', 'true')
			//.css('left', 'auto')
			.css('right', ($(window).width()-295)+'px')
			.css('top', $(domEl).offset().left+65 + 'px');
		if(ISSET($(domEl).attr('help-color'))){
			$('#help-div').css('background-color', $(domEl).attr('help-color'));
		}
	}
};