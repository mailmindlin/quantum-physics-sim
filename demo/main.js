var isFooterVisible=true;
function toggleFooter(){
	if(isFooterVisible==true){
		$('#footer-wrapper').slideUp();
		$('#btm-arrow').animate({top:$('#footer-wrapper').height()});
		isFooterVisible=false;
	}else{
		$('#footer-wrapper').slideDown();
		('#btm-arrow').animate({top:-$('#footer-wrapper').height()});
		isFooterVisible=true;
	}
}
$('body').ready(function(){
	toggleFooter();
	$('#btm-arrow').click(toggleFooter);
});
