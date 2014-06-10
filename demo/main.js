var isFooterVisible=true;
function toggleFooter(){
	if(isFooterVisible==true){
		$('#footer-wrapper').slideUp();
		$('#btm-arrow').animate({top:$('#footer-wrapper').height()+$('#btm-arrow').height()}).addClass('inactive').removeClass('active');
		isFooterVisible=false;
	}else{
		$('#footer-wrapper').slideDown();
		$('#btm-arrow').animate({top:-$('#footer-wrapper').height()-$('#btm-arrow').height()}).addClass('active').removeClass('inactive');
		isFooterVisible=true;
	}
}
$('body').ready(function(){
	toggleFooter();
	$('#btm-arrow').click(toggleFooter);
	//setup jsmol
	JSmolInterface.info.j2s="http://mailmindlin.github.io/quantum-physics-sim/jsmol/jsmol/j2s";
	JSmolInterface.start($('.simulator-canvas')[0]);
});
