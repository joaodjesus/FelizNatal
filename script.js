// Adiciona um listener ao formulário para validar a resposta
document.addEventListener("DOMContentLoaded", () => {
  const desafioForm = document.getElementById("desafioForm");
  if (!desafioForm) return; // Garante que só executa em páginas com o formulário

  const respostasCorretas = {
      index: ["sim", "claro"],
    pagina1: "16 outubro",
    pagina2: ["sala 1.21", "sala da atec", "1.21"],
    pagina3: "arouca",
    pagina4: "barcelona",
    pagina5: ["3 de novembro", "3 novembro"],
    pagina6: ["sim"],
  };

  const currentPage = window.location.pathname.split("/").pop().split(".")[0];
  const respostaCorreta = respostasCorretas[currentPage];

  desafioForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const resposta = document.getElementById("resposta").value.trim().toLowerCase();
    const isCorrect = Array.isArray(respostaCorreta)
      ? respostaCorreta.includes(resposta)
      : resposta === respostaCorreta;

    if (isCorrect) {
      mostrarMensagem("success", "Resposta correta! A avançar...");
      setTimeout(() => {
        avancarParaProximaPagina(currentPage);
      }, 1000);
    } else {
      mostrarMensagem("alert", "Resposta errada! Tenta novamente.");
    }
  });
});

// Mostra a mensagem de sucesso ou erro
function mostrarMensagem(tipo, texto) {
  const mensagemSucesso = document.getElementById("mensagemSucesso");
  const mensagemErro = document.getElementById("mensagemErro");

  if (tipo === "success") {
    mensagemSucesso.textContent = texto;
    mensagemSucesso.classList.remove("hidden");
    mensagemErro.classList.add("hidden");
  } else if (tipo === "alert") {
    mensagemErro.textContent = texto;
    mensagemErro.classList.remove("hidden");
    mensagemSucesso.classList.add("hidden");
  }
}

// Redireciona para a próxima página com base na página atual
function avancarParaProximaPagina(currentPage) {
  const paginas = ["pagina1", "pagina2", "pagina3", "pagina4", "pagina5", "pagina6", "pagina7", "pagina8"];
  const nextPageIndex = paginas.indexOf(currentPage) + 1;

  if (nextPageIndex < paginas.length) {
    const nextPage = `${paginas[nextPageIndex]}.html`;
    window.location.href = nextPage;
  }
}
