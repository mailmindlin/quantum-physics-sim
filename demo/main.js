var isFooterVisible=true;
function toggleFooter(){
	if(isFooterVisible=true){
		$('#footer-wrapper').slideUp();
		isFooterVisible==false;
	}else{
		$('#footer-wrapper').slideUp();
		isFooterVisible==true;
	}
}
$('body').ready(function(){
	toggleFooter();
	$('#btm-arrow').click(toggleFooter());
});
