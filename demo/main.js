var isFooterVisible=true;
function toggleFooter(){
	if(isFooterVisible==true){
		$('#footer-wrapper').slideUp();
		isFooterVisible=false;
	}else{
		$('#footer-wrapper').slideDown();
		isFooterVisible=true;
	}
}
$('body').ready(function(){
	toggleFooter();
	$('#btm-arrow').click(toggleFooter());
});
