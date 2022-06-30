class P4 {
  constructor(
    selector,
    COL = 7,
    LGN = 6,
    colorP1 = "red",
    colorP2 = "yellow",
    nameP1 = "joueur1",
    nameP2 = "joueur2"
  ) {
    this.selector = selector;
    this.COL = COL;
    this.LGN = LGN;
    this.colorP1 = colorP1;
    this.colorP2 = colorP2;
    this.colorPlayer = colorP1;
    this.nameP1 = nameP1;
    this.nameP2 = nameP2;

    this.drawGame();
    this.recherche();
    this.checkWin();
  }

  //affichage du jeu
  drawGame() {
    const $jeu = $(this.selector);

    for (let lgn = 0; lgn < this.LGN; lgn++) {
      const $lgn = $("<div>").addClass("lgn");

      for (let col = 0; col < this.COL; col++) {
        const $col = $("<div>")
          .addClass("col empty")
          .attr("data-col", col)
          .attr("data-lgn", lgn);
        $lgn.append($col);
      }
      $jeu.append($lgn);
    }
  }

  recherche() {
    const $jeu = $(this.selector);
    const colorP1 = this.colorP1;
    const colorP2 = this.colorP2;
    const that = this;
    let winnerp1 = 0;
    let winnerp2 = 0;

    // ajout du nom du joueur 1 + 2
    document.getElementById("player1").innerHTML = winnerp1;
    document.getElementById("player2").innerHTML = winnerp2;

    if (colorP1 == colorP2) {
      alert("les deux joueurs ne peuvent avoir la même couleur !");
    }
    document.getElementById("turn").innerHTML =
      "C'est au tour de  " + that.nameP1 + " de jouer !";

    // on cherche la derniere case libre
    function lastCase(col) {
      const $cells = $(`.col[data-col="${col}"]`);
      for (let i = $cells.length - 1; i >= 0; i--) {
        const $cell = $($cells[i]);
        if ($cell.hasClass("empty")) {
          return $cell;
        }
      }
      return null;
    }
    // animation lors du hover
    $jeu.on("mouseenter", ".col.empty", function () {
      const $col = $(this).data("col");
      const $last = lastCase($col);
      if ($last != null) {
        $last
          .addClass("p" + that.colorPlayer)
          .css("background-color", that.colorPlayer);
      }
    });
    // animation aprés hover
    $jeu.on("mouseleave", ".col", function () {
      $(".p" + that.colorPlayer).css("background-color", "");
      $(".col").removeClass("p" + that.colorPlayer);
    });
    // animation lors du click
    $jeu.on("click", ".col.empty", function () {
      const col = $(this).data("col");
      const $last = lastCase(col);

      $last
        .removeClass("empty p" + that.colorPlayer)
        .data("player", that.colorPlayer)
        .addClass(that.colorPlayer)
        .css("background-color", that.colorPlayer)
        .addClass("fall");

      const winner = that.checkWin($last.data("lgn"), $last.data("col"));

      // Evenement lorsqu"un joueur gagne
      if (winner) {
        // si le joueur 1 gagne ->
        if ($last.hasClass(colorP1)) {
          alert(` ${that.nameP1} a gagné la partie.`);
          $(".col.empty").removeClass("empty"); // Interdiction de rajouter des pions lors d"une victoire
          $("#restart").css("visibility", "visible"); // affichage du bouton restart lors d"un victoire
          winnerp1++;
          document.getElementById("player1").innerHTML = winnerp1;
        }
        // si le joueur 2 gagne ->
        if ($last.hasClass(colorP2)) {
          alert(` ${that.nameP2} a gagné la partie.🍾🍾🍾🍾`);
          $(".col.empty").removeClass("empty"); // Interdiction de rajouter des pions lors d"une victoire
          $("#restart").css("visibility", "visible"); // affichage du bouton restart lors d"un victoire
          winnerp2++;
          document.getElementById("player2").innerHTML = winnerp2;
        }
      }
      // indiquer qui doit jouer
      if (that.colorPlayer === colorP1) {
        document.getElementById("turn").innerHTML =
          "C'est au tour de  " + that.nameP2 + " de jouer !";
      } else {
        document.getElementById("turn").innerHTML =
          "C'est au tour de " + that.nameP1 + " de jouer !";
      }

      // alternance joueurs
      that.colorPlayer = that.colorPlayer === colorP1 ? colorP2 : colorP1; // alterner les joueurs
    });
  }
  // verifier si un des deux joueurs a gagné.
  checkWin(lgn, col) {
    const that = this;

    function $getCell(i, j) {
      return $(`.col[data-lgn="${i}"][data-col="${j}"]`);
    }

    function checkDirection(direction) {
      let total = 0;
      let i = lgn + direction.i;
      let j = col + direction.j;
      let $next = $getCell(i, j);

      while (
        i >= 0 &&
        i < that.LGN &&
        j >= 0 &&
        j < that.COL &&
        $next.data("player") === that.colorPlayer
      ) {
        total++;
        i += direction.i;
        j += direction.j;
        $next = $getCell(i, j);
      }
      return total;
    }

    // verification de victoire
    function checkWin(directionA, directionB) {
      const total = 1 + checkDirection(directionA) + checkDirection(directionB);
      if (total >= 4) {
        return that.colorPlayer;
      } else {
        return null;
      }
    }
    // verification victoire horizontale
    function checkHori() {
      return checkWin({ i: 0, j: -1 }, { i: 0, j: 1 });
    }
    // verification victoire vertical
    function checkVerti() {
      return checkWin({ i: -1, j: 0 }, { i: 1, j: 0 });
    }
    // verification victoire diagonal
    function checkDiag1() {
      return checkWin({ i: 1, j: 1 }, { i: -1, j: -1 });
    }
    // verification victoire diagonal
    function checkDiag2() {
      return checkWin({ i: 1, j: -1 }, { i: -1, j: 1 });
    }

    return checkHori() || checkVerti() || checkDiag1() || checkDiag2();
  }
}
