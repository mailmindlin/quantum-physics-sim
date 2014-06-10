var isFooterVisible=true;
function toggleFooter(){
	if(isFooterVisible==true){
		$('#footer-wrapper').slideUp();
		$('#btm-arrow').animate({top:$('#footer-wrapper').height()}).addClass('active').removeClass('inactive');
		isFooterVisible=false;
	}else{
		$('#footer-wrapper').slideDown();
		$('#btm-arrow').animate({top:-$('#footer-wrapper').height()}).addClass('inactive').removeClass('active');
		isFooterVisible=true;
	}
}
$('body').ready(function(){
	toggleFooter();
	$('#btm-arrow').click(toggleFooter);
});
