document.addEventListener("DOMContentLoaded", () => {
    const quizContainer = document.getElementById("quiz-container");
    const submitButton = document.getElementById("submit-btn");
    const resultDiv = document.getElementById("result");

    let questions = [];
    let selectedAnswers = {};

    // Загружаем вопросы из JSON
    fetch("data/data.json")
        .then(response => response.json())
        .then(data => {
            questions = shuffleArray(data).slice(0, 5); // Перемешиваем и берем 5 случайных вопросов
            generateQuiz(questions);
        })
        .catch(error => console.error("Fehler beim Laden der Daten:", error));

    function generateQuiz(questions) {
        quizContainer.innerHTML = ""; // Очищаем контейнер

        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.classList.add("question");

            questionDiv.innerHTML = `<p><strong>Frage ${index + 1}:</strong> ${question.question}</p>`;

            const shuffledOptions = shuffleArray(question.options);
            shuffledOptions.forEach(option => {
                const optionButton = document.createElement("button");
                optionButton.classList.add("option");
                optionButton.textContent = `${option.text} (${option.preposition})`;
                optionButton.dataset.index = index;
                optionButton.dataset.preposition = option.preposition;
                optionButton.addEventListener("click", handleOptionClick);
                questionDiv.appendChild(optionButton);
            });

            // Добавляем скрытый div для объяснения
            const explanationDiv = document.createElement("div");
            explanationDiv.classList.add("explanation");
            explanationDiv.style.display = "none"; // Скрываем изначально
            questionDiv.appendChild(explanationDiv);

            quizContainer.appendChild(questionDiv);
        });
    }

    function handleOptionClick(event) {
        const index = event.target.dataset.index;
        const preposition = event.target.dataset.preposition;

        selectedAnswers[index] = preposition;

        // Сбрасываем цвет кнопок для этого вопроса
        const allOptions = document.querySelectorAll(`.question:nth-child(${parseInt(index) + 1}) .option`);
        allOptions.forEach(button => button.classList.remove("selected"));
        allOptions.forEach(button => button.style.backgroundColor = "");

        // Подсвечиваем выбранную кнопку
        event.target.classList.add("selected");
    }

    submitButton.addEventListener("click", () => {
        if (Object.keys(selectedAnswers).length < questions.length) {
            alert("Bitte beantworten Sie alle Fragen!");
            return;
        }
        checkAnswers();
    });

    function checkAnswers() {
        let correctCount = 0;
        let incorrectCount = 0;

        questions.forEach((question, index) => {
            const userAnswer = selectedAnswers[index];
            const correctAnswer = question.answer;

            const allOptions = document.querySelectorAll(`.question:nth-child(${index + 1}) .option`);
            const explanationDiv = document.querySelectorAll(".explanation")[index];

            allOptions.forEach(button => {
                if (button.dataset.preposition === correctAnswer) {
                    button.classList.add("correct");
                } else if (button.dataset.preposition === userAnswer) {
                    button.classList.add("incorrect");
                    incorrectCount++;
                }
            });

            if (userAnswer === correctAnswer) {
                correctCount++;
            }

            // Показать объяснение
            explanationDiv.innerHTML = `<p><strong>Warum?</strong> ${question.explanation}</p>`;
            explanationDiv.style.display = "block";
        });

        // Обновляем результат
        resultDiv.innerHTML = `<p>Ergebnis: <span style="color:green;">${correctCount} richtig</span>, <span style="color:red;">${incorrectCount} falsch</span></p>`;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
});
