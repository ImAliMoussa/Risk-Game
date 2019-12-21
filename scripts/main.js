let userChoseArr = [];

$("path").each(function(){
  $(this).click(function(){
    //console.log($(this).attr("name"));
    userChoseArr.push(parseInt( $(this).attr("id"),10));
  });

  $(this).hover(function(){
    $(this).css("opacity", 0.7);
  }, function(){
    $(this).css("opacity", 0.4);
  });

  $(this).css("fill", "green");
});

function checkAllCorrect(){
  for (let inx = 0; inx < 27; inx++) {
    let s = inx.toString(10);
    let str1 = s + "circle";
    let str2 = s + "label";
    const el = document.getElementById(s);
    const elcir = document.getElementById(str1);
    const ellab = document.getElementById(str2);
    $("#" + s + "label").text("0");
    if (el != null && elcir != null && ellab != null) continue;
    else alert(inx);
  }
}

checkAllCorrect();

$("circle").css("stroke", "green");