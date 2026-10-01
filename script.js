// ==========================================
// BOTÃO LEGENDS
// JOGO DE FUTEBOL DE BOTÃO
// ==========================================


// ==========================================
// 12 TIMES
// ==========================================

const teams = [

    {
        name: "Aurora Rubra",
        color: "#e63946"
    },

    {
        name: "Brisa Cobalto",
        color: "#277da1"
    },

    {
        name: "Lobos Âmbar",
        color: "#f4a261"
    },

    {
        name: "Névoa Violeta",
        color: "#8e5de7"
    },

    {
        name: "Verde Pulsar",
        color: "#39b54a"
    },

    {
        name: "Titãs Coral",
        color: "#ff6f61"
    },

    {
        name: "Solaris Dourado",
        color: "#f6c945"
    },

    {
        name: "Maré Turquesa",
        color: "#20c9b0"
    },

    {
        name: "Raios Índigo",
        color: "#5964d8"
    },

    {
        name: "Floresta Lima",
        color: "#91c83e"
    },

    {
        name: "Vento Magenta",
        color: "#d64bb5"
    },

    {
        name: "Ferro Grafite",
        color: "#718096"
    }

];


// ==========================================
// ELEMENTOS
// ==========================================

const teamSelect =
    document.querySelector("#teamSelect");

const modeSelect =
    document.querySelector("#modeSelect");

const field =
    document.querySelector("#field");

const ball =
    document.querySelector("#ball");

const aim =
    document.querySelector("#aim");


// ==========================================
// PREENCHER TIMES
// ==========================================

teams.forEach(
    (team, index) => {

        const option =
            document.createElement(
                "option"
            );

        option.value = index;

        option.textContent =
            team.name;

        teamSelect.appendChild(
            option
        );

    }
);


// ==========================================
// MOSTRAR TIMES
// ==========================================

document.querySelector(
    "#teamsGrid"
).innerHTML =

teams.map(
    team => `

        <div class="teamCard">

            <span
                class="badge"
                style="
                    background:${team.color}
                ">
            </span>

            <b>
                ${team.name}
            </b>

            <br>

            <small>
                Clube fictício
            </small>

        </div>

    `
).join("");


// ==========================================
// VARIÁVEIS DO CAMPEONATO
// ==========================================

let bracket = [];

let currentRound = 0;

let game = null;

let timer = null;

let paused = false;

let sound = true;

let dragging = null;

let dragStart = null;


// ==========================================
// EMBARALHAR
// ==========================================

function shuffle(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );

}


// ==========================================
// CRIAR CHAVE
// ==========================================

function createBracket() {

    const order =
        shuffle(
            [...Array(12).keys()]
        );


    bracket = [
        [],
        [],
        []
    ];


    // 4 jogos preliminares

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        bracket[0].push([

            order[i * 2],

            order[i * 2 + 1],

            null

        ]);

    }


    // vagas extras

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        bracket[0].push([
            null,
            null,
            null
        ]);

    }


    // quartas

    bracket[1] =
        Array.from(
            {
                length: 4
            },
            () => [
                null,
                null,
                null
            ]
        );


    // semifinais

    bracket[2] = [

        [
            null,
            null,
            null
        ],

        [
            null,
            null,
            null
        ]

    ];


    renderBracket();

}


// ==========================================
// RENDERIZAR CHAVE
// ==========================================

function renderBracket() {

    const getName = index => {

        if (index == null) {

            return "A definir";

        }

        return teams[index].name;

    };


    const rounds = [

        [
            "Preliminar",
            bracket[0]
        ],

        [
            "Quartas",
            bracket[1]
        ],

        [
            "Semifinais",
            bracket[2]
        ],

        [
            "Final",
            bracket[3]
                ? [bracket[3]]
                : [
                    [
                        null,
                        null,
                        null
                    ]
                ]
        ]

    ];


    document.querySelector(
        "#bracket"
    ).innerHTML =

    rounds.map(
        ([title, matches]) => `

            <div class="round">

                <h3>
                    ${title}
                </h3>

                ${matches.map(
                    match => `

                        <div class="match">

                            <div class="row">

                                ${getName(
                                    match[0]
                                )}

                            </div>


                            <div class="row">

                                ${getName(
                                    match[1]
                                )}

                            </div>

                        </div>

                    `
                ).join("")}

            </div>

        `
    ).join("");

}


// ==========================================
// INICIAR CAMPEONATO
// ==========================================

function startTournament() {

    createBracket();


    const selected =
        Number(
            teamSelect.value
        );


    let found =
        bracket[0].findIndex(
            match =>
                match[0] === selected ||
                match[1] === selected
        );


    if (found < 0) {

        const original =
            bracket[0][0][0];

        bracket[0][0][0] =
            selected;

        bracket[0][0][1] =
            original;

    }


    document.querySelector(
        "#gameArea"
    ).style.display = "block";


    document.querySelector(
        "#welcome"
    ).style.display = "none";


    currentRound = 0;


    renderBracket();


    toast(
        "🏆 Campeonato iniciado!"
    );


    beginNextPlayerMatch();

}


// ==========================================
// PRÓXIMA PARTIDA
// ==========================================

function beginNextPlayerMatch() {

    const selected =
        Number(
            teamSelect.value
        );


    const match =
        findPlayerMatch(
            selected
        );


    if (match) {

        startMatch(
            match.a,
            match.b
        );

    }

}


// ==========================================
// LOCALIZAR JOGO DO JOGADOR
// ==========================================

function findPlayerMatch(
    selected
) {

    for (
        let r = 0;
        r < bracket.length;
        r++
    ) {

        if (!bracket[r]) {
            continue;
        }


        for (
            let i = 0;
            i < bracket[r].length;
            i++
        ) {

            const match =
                bracket[r][i];


            if (
                match &&
                (
                    match[0] === selected ||
                    match[1] === selected
                ) &&
                match[2] == null
            ) {

                return {

                    r,

                    i,

                    a: match[0],

                    b: match[1]

                };

            }

        }

    }


    return null;

}


// ==========================================
// INICIAR PARTIDA
// ==========================================

function startMatch(
    home,
    away
) {

    if (
        home == null ||
        away == null
    ) {

        return;

    }


    game = {

        home: home,

        away: away,

        hs: 0,

        as: 0,

        time: 240,

        turn: 0,

        mode:
            modeSelect.value,

        active: true

    };


    const homeTeam =
        teams[home];

    const awayTeam =
        teams[away];


    document.querySelector(
        "#homeName"
    ).innerHTML = `

        <span
            class="badge"
            style="
                background:${homeTeam.color}
            ">
        </span>

        ${homeTeam.name}

    `;


    document.querySelector(
        "#awayName"
    ).innerHTML = `

        <span
            class="badge"
            style="
                background:${awayTeam.color}
            ">
        </span>

        ${awayTeam.name}

    `;


    document.querySelector(
        "#homeScore"
    ).textContent = "0";


    document.querySelector(
        "#awayScore"
    ).textContent = "0";


    document.querySelector(
        "#clock"
    ).textContent = "4:00";


    paused = false;


    document.querySelector(
        "#pauseBtn"
    ).textContent =
        "⏸ Pausar";


    createDiscs();


    placeBall(
        .5,
        .5
    );


    clearInterval(timer);


    timer =
        setInterval(
            tick,
            250
        );


    updateTurn();

}


// ==========================================
// CRONÔMETRO
// ==========================================

function tick() {

    if (
        !game ||
        !game.active ||
        paused
    ) {

        return;

    }


    game.time -= .25;


    if (game.time < 0) {

        game.time = 0;

    }


    const seconds =
        Math.ceil(
            game.time
        );


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    document.querySelector(
        "#clock"
    ).textContent =

        `${minutes}:${String(
            remaining
        ).padStart(2, "0")}`;


    if (
        game.time <= 0
    ) {

        finishMatch();

    }

}


// ==========================================
// CRIAR BOTÕES
// ==========================================

function createDiscs() {

    document
        .querySelectorAll(
            ".disc"
        )
        .forEach(
            element =>
                element.remove()
        );


    const leftPositions = [

        .20,
        .20,
        .20,
        .28,
        .28,
        .28,
        .36,
        .36,
        .36

    ];


    const rightPositions =
        leftPositions
            .map(
                value =>
                    1 - value
            )
            .reverse();


    leftPositions.forEach(
        (x, index) => {

            addDisc(
                x,
                .25 +
                    index *
                    .065,

                0,

                index
            );

        }
    );


    rightPositions.forEach(
        (x, index) => {

            addDisc(
                x,
                .25 +
                    index *
                    .065,

                1,

                index
            );

        }
    );

}


// ==========================================
// ADICIONAR BOTÃO
// ==========================================

function addDisc(
    x,
    y,
    side,
    index
) {

    const disc =
        document.createElement(
            "div"
        );


    disc.className =
        "disc";


    disc.dataset.side =
        side;


    disc.dataset.index =
        index;


    const team =
        teams[
            side
                ? game.away
                : game.home
        ];


    disc.style.background =
        team.color;


    disc.style.left =
        x * 100 + "%";


    disc.style.top =
        y * 100 + "%";


    field.appendChild(
        disc
    );

}


// ==========================================
// POSIÇÃO DA BOLA
// ==========================================

function placeBall(
    x,
    y
) {

    ball.style.left =
        x * 100 + "%";


    ball.style.top =
        y * 100 + "%";


    ball.dataset.x =
        x;


    ball.dataset.y =
        y;

}


// ==========================================
// COORDENADAS
// ==========================================

function getCoordinates(
    event
) {

    const rect =
        field.getBoundingClientRect();


    const x =
        (
            event.clientX -
            rect.left
        ) /
        rect.width;


    const y =
        (
            event.clientY -
            rect.top
        ) /
        rect.height;


    return {

        x:
            Math.max(
                .01,
                Math.min(
                    .99,
                    x
                )
            ),

        y:
            Math.max(
                .01,
                Math.min(
                    .99,
                    y
                )
            )

    };

}


// ==========================================
// LOCALIZAR BOTÃO DO JOGADOR
// ==========================================

function playerDiscAt(
    position
) {

    return [

        ...document
            .querySelectorAll(
                ".disc"
            )

    ].find(
        disc => {

            const x =
                parseFloat(
                    disc.style.left
                ) / 100;


            const y =
                parseFloat(
                    disc.style.top
                ) / 100;


            return (

                Number(
                    disc.dataset.side
                ) ===
                game.turn

            ) &&

            Math.hypot(
                x - position.x,
                y - position.y
            ) < .045;

        }
    );

}


// ==========================================
// TOQUE / MOUSE
// ==========================================

field.addEventListener(
    "pointerdown",
    event => {

        if (
            !game ||
            !game.active ||
            paused
        ) {

            return;

        }


        if (
            game.mode === "cpu" &&
            game.turn === 1
        ) {

            return;

        }


        const position =
            getCoordinates(
                event
            );


        const disc =
            playerDiscAt(
                position
            );


        if (!disc) {

            return;

        }


        dragging =
            disc;


        dragStart =
            position;


        aim.style.display =
            "block";


        field.setPointerCapture(
            event.pointerId
        );


        updateAim(
            position
        );

    }
);


// ==========================================
// MOVER MOUSE / DEDO
// ==========================================

field.addEventListener(
    "pointermove",
    event => {

        if (!dragging) {

            return;

        }


        const position =
            getCoordinates(
                event
            );


        updateAim(
            position
        );

    }
);


// ==========================================
// SOLTAR
// ==========================================

field.addEventListener(
    "pointerup",
    event => {

        if (!dragging) {

            return;

        }


        const position =
            getCoordinates(
                event
            );


        const dx =
            dragStart.x -
            position.x;


        const dy =
            dragStart.y -
            position.y;


        const power =
            Math.min(
                1,
                Math.hypot(
                    dx,
                    dy
                ) * 3
            );


        dragging = null;


        aim.style.display =
            "none";


        if (
            power < .05
        ) {

            return;

        }


        shoot(
            dragStart.x,
            dragStart.y,
            dx,
            dy,
            power
        );

    }
);


// ==========================================
// LINHA DE MIRA
// ==========================================

function updateAim(
    position
) {

    const dx =
        dragStart.x -
        position.x;


    const dy =
        dragStart.y -
        position.y;


    const length =
        Math.min(
            220,
            Math.hypot(
                dx,
                dy
            ) *
            field.clientWidth
        );


    aim.style.left =
        dragStart.x *
        100 +
        "%";


    aim.style.top =
        dragStart.y *
        100 +
        "%";


    aim.style.width =
        length +
        "px";


    aim.style.transform =
        `rotate(
            ${Math.atan2(
                dy,
                dx
            )}rad
        )`;

}


// ==========================================
// CHUTE
// ==========================================

function shoot(
    x,
    y,
    dx,
    dy,
    power
) {

    const target =
        [
            ...document
                .querySelectorAll(
                    ".disc"
                )
        ].find(
            element => {

                const elementX =
                    parseFloat(
                        element.style.left
                    ) / 100;


                const elementY =
                    parseFloat(
                        element.style.top
                    ) / 100;


                return Math.hypot(
                    elementX - x,
                    elementY - y
                ) < .05;

            }
        );


    if (!target) {

        return;

    }


    let targetX =
        x +
        dx *
        power *
        .8;


    let targetY =
        y +
        dy *
        power *
        .8;


    targetX =
        Math.max(
            .025,
            Math.min(
                .975,
                targetX
            )
        );


    targetY =
        Math.max(
            .025,
            Math.min(
                .975,
                targetY
            )
        );


    target.style.left =
        targetX *
        100 +
        "%";


    target.style.top =
        targetY *
        100 +
        "%";


    const ballX =
        Number(
            ball.dataset.x
        );


    const ballY =
        Number(
            ball.dataset.y
        );


    if (
        Math.hypot(
            targetX - ballX,
            targetY - ballY
        ) < .09
    ) {

        let nx =
            ballX -
            targetX;


        let ny =
            ballY -
            targetY;


        const length =
            Math.hypot(
                nx,
                ny
            );


        nx /= length;

        ny /= length;


        const speed =
            .10 +
            power *
            .23;


        moveBall(
            ballX +
                nx *
                speed,

            ballY +
                ny *
                speed
        );

    }


    game.turn =
        game.turn
            ? 0
            : 1;


    updateTurn();


    if (
        game.mode === "cpu" &&
        game.turn === 1
    ) {

        setTimeout(
            aiMove,
            550
        );

    }

}


// ==========================================
// MOVER BOLA
// ==========================================

function moveBall(
    x,
    y
) {

    x =
        Math.max(
            -.02,
            Math.min(
                1.02,
                x
            )
        );


    y =
        Math.max(
            .02,
            Math.min(
                .98,
                y
            )
        );


    // GOL ESQUERDO

    if (
        x < 0 &&
        y > .39 &&
        y < .61
    ) {

        goal(1);

        return;

    }


    // GOL DIREITO

    if (
        x > 1 &&
        y > .39 &&
        y < .61
    ) {

        goal(0);

        return;

    }


    x =
        Math.max(
            .01,
            Math.min(
                .99,
                x
            )
        );


    y =
        Math.max(
            .01,
            Math.min(
                .99,
                y
            )
        );


    placeBall(
        x,
        y
    );

}


// ==========================================
// GOL
// ==========================================

function goal(
    side
) {

    let scoringTeam;


    if (
        side === 0
    ) {

        game.as++;

        scoringTeam =
            game.away;

    }

    else {

        game.hs++;

        scoringTeam =
            game.home;

    }


    document.querySelector(
        "#homeScore"
    ).textContent =
        game.hs;


    document.querySelector(
        "#awayScore"
    ).textContent =
        game.as;


    placeBall(
        .5,
        .5
    );


    toast(
        `⚽ GOL! ${
            teams[
                scoringTeam
            ].name
        }`
    );


    game.turn =
        side === 0
            ? 0
            : 1;


    updateTurn();

}


// ==========================================
// TURNO
// ==========================================

function updateTurn() {

    const team =
        game.turn === 0
            ? teams[game.home]
            : teams[game.away];


    const text =
        game.mode === "cpu" &&
        game.turn === 1

            ? `${team.name} • IA`

            : `${team.name} • vez do jogador`;


    document.querySelector(
        "#turnText"
    ).textContent =
        text;

}


// ==========================================
// INTELIGÊNCIA ARTIFICIAL
// ==========================================

function aiMove() {

    if (
        !game ||
        !game.active ||
        paused ||
        game.turn !== 1
    ) {

        return;

    }


    const discs =
        [
            ...document
                .querySelectorAll(
                    ".disc"
                )
        ].filter(
            disc =>
                Number(
                    disc.dataset.side
                ) === 1
        );


    if (
        !discs.length
    ) {

        return;

    }


    const disc =
        discs[
            Math.floor(
                Math.random() *
                discs.length
            )
        ];


    const x =
        parseFloat(
            disc.style.left
        ) / 100;


    const y =
        parseFloat(
            disc.style.top
        ) / 100;


    const ballX =
        Number(
            ball.dataset.x
        );


    const ballY =
        Number(
            ball.dataset.y
        );


    let dx =
        ballX -
        x;


    let dy =
        ballY -
        y;


    const length =
        Math.hypot(
            dx,
            dy
        );


    if (
        length === 0
    ) {

        return;

    }


    dx /= length;

    dy /= length;


    shoot(
        x,
        y,
        dx,
        dy,
        .55 +
        Math.random() *
        .4
    );

}


// ==========================================
// FINALIZAR PARTIDA
// ==========================================

function finishMatch() {

    if (
        !game ||
        !game.active
    ) {

        return;

    }


    game.active =
        false;


    clearInterval(
        timer
    );


    let winner;


    if (
        game.hs >
        game.as
    ) {

        winner =
            game.home;

    }

    else if (
        game.as >
        game.hs
    ) {

        winner =
            game.away;

    }

    else {

        // PÊNALTIS

        winner =
            Math.random() < .5
                ? game.home
                : game.away;


        document.querySelector(
            "#modalIcon"
        ).textContent =
            "🥅";


        document.querySelector(
            "#modalTitle"
        ).textContent =
            "Pênaltis!";


        document.querySelector(
            "#modalText"
        ).textContent =

            `Empate em ${
                game.hs
            } × ${
                game.as
            }. ${
                teams[winner].name
            } venceu nos pênaltis.`;

    }


    if (
        game.hs !== game.as
    ) {

        document.querySelector(
            "#modalIcon"
        ).textContent =
            "🏆";


        document.querySelector(
            "#modalTitle"
        ).textContent =

            winner ===
            Number(
                teamSelect.value
            )

                ? "Você avançou!"

                : "Fim da partida";


        document.querySelector(
            "#modalText"
        ).textContent =

            `${teams[game.home].name}
            ${game.hs}
            ×
            ${game.as}
            ${teams[game.away].name}.

            ${
                teams[winner].name
            }
            avança.`;

    }


    document.querySelector(
        "#modal"
    ).style.display =
        "flex";

}


// ==========================================
// PAUSAR
// ==========================================

document.querySelector(
    "#pauseBtn"
).onclick = () => {

    if (!game) {

        return;

    }


    paused =
        !paused;


    document.querySelector(
        "#pauseBtn"
    ).textContent =

        paused
            ? "▶ Continuar"
            : "⏸ Pausar";


    toast(
        paused
            ? "⏸ Partida pausada"
            : "▶ Partida retomada"
    );

};


// ==========================================
// REINICIAR
// ==========================================

document.querySelector(
    "#restartMatchBtn"
).onclick = () => {

    if (!game) {

        return;

    }


    startMatch(
        game.home,
        game.away
    );

};


// ==========================================
// ENCERRAR
// ==========================================

document.querySelector(
    "#forfeitBtn"
).onclick = () => {

    if (!game) {

        return;

    }


    game.active =
        false;


    clearInterval(
        timer
    );


    const winner =
        game.turn === 0
            ? game.away
            : game.home;


    document.querySelector(
        "#modalIcon"
    ).textContent =
        "🏳";


    document.querySelector(
        "#modalTitle"
    ).textContent =
        "Partida encerrada";


    document.querySelector(
        "#modalText"
    ).textContent =

        `${teams[winner].name}
        avançou por encerramento
        da partida.`;


    document.querySelector(
        "#modal"
    ).style.display =
        "flex";

};


// ==========================================
// INICIAR
// ==========================================

document.querySelector(
    "#startBtn"
).onclick =
    startTournament;


// ==========================================
// MODO ESCURO / CLARO
// ==========================================

document.querySelector(
    "#themeBtn"
).onclick = function() {

    document.body
        .classList
        .toggle(
            "light"
        );


    this.textContent =

        document.body
            .classList
            .contains(
                "light"
            )

            ? "☀️ Modo claro"

            : "🌙 Modo escuro";

};


// ==========================================
// SOM
// ==========================================

document.querySelector(
    "#soundBtn"
).onclick = function() {

    sound =
        !sound;


    this.textContent =

        sound

            ? "🔊 Som"

            : "🔇 Som";

};


// ==========================================
// ABAS
// ==========================================

document
    .querySelectorAll(
        ".tab"
    )
    .forEach(
        tab => {

            tab.onclick =
                () => {

                    document
                        .querySelectorAll(
                            ".tab"
                        )
                        .forEach(
                            item =>
                                item
                                    .classList
                                    .remove(
                                        "active"
                                    )
                        );


                    tab.classList
                        .add(
                            "active"
                        );


                    const tabs = [

                        "game",
                        "bracket",
                        "teams",
                        "rules"

                    ];


                    tabs.forEach(
                        name => {

                            document
                                .querySelector(
                                    `#${name}Tab`
                                )
                                .style
                                .display =

                                tab.dataset.tab ===
                                name

                                    ? "block"

                                    : "none";

                        }
                    );

                };

        }
    );


// ==========================================
// MODAL
// ==========================================

document.querySelector(
    "#modalBtn"
).onclick = () => {

    document.querySelector(
        "#modal"
    ).style.display =
        "none";


    const selected =
        Number(
            teamSelect.value
        );


    const match =
        findPlayerMatch(
            selected
        );


    if (match) {

        startMatch(
            match.a,
            match.b
        );

    }

};


// ==========================================
// NOTIFICAÇÃO
// ==========================================

function toast(
    message
) {

    const element =
        document.querySelector(
            "#toast"
        );


    element.textContent =
        message;


    element.classList
        .add(
            "show"
        );


    setTimeout(
        () => {

            element.classList
                .remove(
                    "show"
                );

        },
        1800
    );

}


// ==========================================
// INICIAR CHAVE
// ==========================================

createBracket();

renderBracket();