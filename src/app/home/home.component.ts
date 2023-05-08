import {Component, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  minutes!: number;
  seconds!: number;
  intervalId: any;
  questions = [
    {
      id: 1,
      questionText: "Quel est le plus grand océan du monde ?",
      options: [
        {value: "Océan Atlantique"},
        {value: "Océan Pacifique"},
        {value: "Océan Indien"},
        {value: "Océan Arctique"}
      ],
      correctOption: "Océan Pacifique"
    },
    {
      id: 2,
      questionText: "Quelle est la capitale de l'Espagne ?",
      options: [
        {value: "Madrid"},
        {value: "Barcelone"},
        {value: "Valence"},
        {value: "Séville"}
      ],
      correctOption: "Madrid"
    },
    {
      id: 3,
      questionText: "Quelle est la plus grande île du monde ?",
      options: [
        {value: "Australie"},
        {value: "Groenland"},
        {value: "Madagascar"},
        {value: "Sumatra"}
      ],
      correctOption: "Groenland"
    },
    {
      id: 4,
      questionText: "Quel est le plus grand désert du monde ?",
      options: [
        {value: "Sahara"},
        {value: "Arctique"},
        {value: "Gobi"},
        {value: "Atacama"}
      ],
      correctOption: "Sahara"
    },
    {
      id: 5,
      questionText: "Combien de planètes dans notre système solaire ont des anneaux ?",
      options: [
        {value: "1"},
        {value: "2"},
        {value: "3"},
        {value: "4"}
      ],
      correctOption: "4"
    },
    {
      id: 6,
      questionText: "Quel pays est le plus grand producteur de café au monde ?",
      options: [
        {value: "Brésil"},
        {value: "Colombie"},
        {value: "Vietnam"},
        {value: "Indonésie"}
      ],
      correctOption: "Brésil"
    },
    {
      id: 7,
      questionText: "Quel est le plus grand pays d'Afrique en termes de superficie ?",
      options: [
        {value: "Algérie"},
        {value: "Nigeria"},
        {value: "République démocratique du Congo"},
        {value: "Soudan"}
      ],
      correctOption: "Algérie"
    },
    {
      id: 8,
      questionText: "Dans quel pays se trouve le Taj Mahal ?",
      options: [
        {value: "Inde"},
        {value: "Pakistan"},
        {value: "Bangladesh"},
        {value: "Népal"}
      ],
      correctOption: "Inde"
    },
    {
      id: 9,
      questionText: "Quel est le plus grand lac d'Amérique du Nord ?",
      options: [
        {value: "Lac Supérieur"},
        {value: "Lac Michigan"},
        {value: "Lac Huron"},
        {value: "Lac Érié"}
      ],
      correctOption: "Lac Supérieur"
    },
    {
      id: 10,
      questionText: "Combien de temps faut-il pour faire le tour du monde en avion ?",
      options: [
        {value: "24 heures"},
        {value: "48 heures"},
        {value: "72 heures"},
        {value: "96 heures"}
      ],
      correctOption: "48 heures"
    }
  ];

  totalQuestions: number = 0; // totalQuestions of QCM

  myResponses: any[] = [];

  currentQuestion: number = 0;

  isFinished: boolean = false;

  gameStarted: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (!this.isFinished) {
      this.saveTime();
    }
  }

  ngOnInit(): void {
    this.totalQuestions = this.questions.length;
    const storedCurrentQuestion = localStorage.getItem('currentQuestion');
    const storedMyResponses = localStorage.getItem('myResponses');
    const savedTime = localStorage.getItem('counterTime');
    const gameStarted = localStorage.getItem('gameStarted');

    if (storedCurrentQuestion && storedMyResponses) {
      this.currentQuestion = parseInt(storedCurrentQuestion) + 1;
      this.myResponses = JSON.parse(storedMyResponses);
    } else {
      // initialisation de myResponses
      this.initializeMyResponses();
    }

    if (savedTime) {
      const time = JSON.parse(savedTime);
      this.minutes = time.minutes;
      this.seconds = time.seconds;
      this.startTimer();
    }
    if (gameStarted) {
      this.gameStarted = true;
    }

  }

  startGame() {
    this.clearLocalStorage();
    this.gameStarted = true;
    localStorage.setItem('gameStarted', String(this.gameStarted.toString()));
    this.minutes = 1;
    this.seconds = 0;
    this.startTimer();
  }

  onSubmit() {
    if (this.myResponses[this.currentQuestion].selectedResponse !== '') {
      this.myResponses[this.currentQuestion].answered = true;
    }

    localStorage.setItem('currentQuestion', this.currentQuestion.toString());
    localStorage.setItem('myResponses', JSON.stringify(this.myResponses));

    if (this.currentQuestion + 1 == this.questions.length) {
      this.gameStarted = false;
      this.isFinished = true;
      this.clearLocalStorage();
    } else {
      this.currentQuestion++;
    }
  }

  goToPrevious() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  goToQuestion(nb: number) {
    this.currentQuestion = nb;
  }

  countGoodResponse() {
    return this.myResponses.reduce((count, response, i) => {
      if (response.answered && response.selectedResponse === this.questions[i].correctOption) {
        count++;
      }
      return count;
    }, 0);
  }

  private startTimer() {
    this.intervalId = setInterval(() => {
      if (this.seconds === 0) {
        this.minutes--;
        this.seconds = 59;
      } else {
        this.seconds--;
      }
      if (this.minutes === 0 && this.seconds === 0) {
        clearInterval(this.intervalId);
        this.isFinished = true;
        this.clearLocalStorage();
      }
    }, 1000);
  }

  private saveTime() {
    const time = {minutes: this.minutes, seconds: this.seconds};
    localStorage.setItem('counterTime', JSON.stringify(time));
  }

  private clearLocalStorage() {
    localStorage.removeItem('currentQuestion');
    localStorage.removeItem('myResponses');
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('counterTime');
  }

  private initializeMyResponses() {
    for (let i = 0; i < this.totalQuestions; i++) {
      this.myResponses.push({
        id: i,
        selectedResponse: "",
        answered: false
      });
    }
  }
}
