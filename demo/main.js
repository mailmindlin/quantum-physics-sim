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
	$('.simulator-canvas').html(JSmolInterface.start('jsmol'));
});
