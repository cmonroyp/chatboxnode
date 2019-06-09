function chatbotInit() {
  var div = document.createElement("div");
  document.getElementsByTagName("body")[0].appendChild(div);
  div.outerHTML =
    "<div id='botDiv' style='height: 38px; box-shadow:0 5px 15px rgba(0,0,0,0.4); position: fixed; bottom: 0; right:35px; background-color: #202430'><div id='botTitleBar' style='height: 38px; width: 400px;color: #FFF;background: -webkit-linear-gradient(#FFF, #FFF); -webkit-background-clip: text;-webkit-text-fill-color: transparent; padding: 10px; position:fixed; cursor: pointer;'>Asistente (Online Now)</div><iframe style='padding-top: 30px;font-size:10px' width='400px' height='565px' src='https://console.dialogflow.com/api-client/demo/embedded/0cb765dd-def3-4abf-ad3c-ccfefffc362a'></iframe></div>";
  document.getElementById("botTitleBar").addEventListener("click", function(e) {
    e.target.matches = e.target.matches || e.target.msMatchesSelector;
    if (e.target.matches("#botTitleBar")) {
      var botDiv = document.querySelector("#botDiv");
      botDiv.style.height = botDiv.style.height == "600px" ? "38px" : "600px";
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  chatbotInit();
});
