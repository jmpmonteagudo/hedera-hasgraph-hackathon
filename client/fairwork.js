$(document).ready(function() {
  registerTabs();
});

function registerTabs() {
  console.log('registering tabs');
  $("div.fairwork-tab-menu>div.list-group>a").click(function(e) {
    e.preventDefault();
    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");
    const index = $(this).index();
    console.log('selected tab', index);
    $("div.fairwork-tab>div.fairwork-tab-content").removeClass("active");
    $("div.fairwork-tab>div.fairwork-tab-content").eq(index).addClass("active");
});
}