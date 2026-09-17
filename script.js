const viewport = document.querySelector('.quiz-viewport');
const track = document.getElementById('quiz-track');
const slides = document.querySelectorAll('.slide');
const backBtn = document.getElementById('back');
const nextBtn = document.getElementById('next');
const progress = document.getElementById('quiz-progress');
const nameInput = document.getElementById('product-name');
const fillTargets = document.querySelectorAll('.fill-name');
const resultScore = document.getElementById('result-score');
const resultText = document.getElementById('result-text');
const retakeBtn = document.getElementById('retake');

const questionSlides = Array.from(slides).filter(slide => slide.dataset.weight);
const lastIndex = slides.length - 1;
let current = 0;

const verdicts = [
  { max: 0.3, text: 'This is concerning. Time to actually close some gaps.' },
  { max: 0.6, text: 'Getting there. A few real gaps left.' },
  { max: 0.9, text: 'Solid shape. Just a couple of loose ends.' },
  { max: 1, text: 'Excellent shape. You have clearly done the work.' }
];

function updateName() {
  const value = nameInput.value.trim() || 'your product';
  fillTargets.forEach(el => {
    el.textContent = value;
  });
}

function goTo(index) {
  current = Math.max(0, Math.min(index, lastIndex));
  track.style.transform = 'translateX(-' + (current * 100) + '%)';
  backBtn.disabled = current === 0;

  if (current === 0) {
    progress.textContent = '';
  } else if (current === lastIndex) {
    progress.textContent = '';
  } else {
    progress.textContent = 'Question ' + current + ' of ' + questionSlides.length;
  }

  if (current === lastIndex - 1) {
    nextBtn.textContent = 'See your results';
  } else {
    nextBtn.textContent = 'Next';
  }

  nextBtn.hidden = current === lastIndex;
}

function showResults() {
  let total = 0;
  questionSlides.forEach(slide => {
    const selected = slide.querySelector('input:checked');
    total += selected ? Number(selected.value) : 0;
  });

  const fraction = total / questionSlides.length;
  const percent = Math.round(fraction * 100);
  const verdict = verdicts.find(v => fraction <= v.max) || verdicts[verdicts.length - 1];

  resultScore.textContent = percent + '%';
  resultText.textContent = verdict.text;
}

nextBtn.addEventListener('click', () => {
  if (current === lastIndex - 1) {
    showResults();
  }
  goTo(current + 1);
});

backBtn.addEventListener('click', () => {
  goTo(current - 1);
});

retakeBtn.addEventListener('click', () => {
  document.querySelectorAll('.slide input[type="radio"]').forEach(input => {
    input.checked = false;
  });
  nameInput.value = '';
  updateName();
  goTo(0);
});

nameInput.addEventListener('input', updateName);

function lockQuizHeight() {
  viewport.style.height = 'auto';
  const natural = viewport.getBoundingClientRect().height;
  viewport.style.height = natural + 'px';
}

updateName();
goTo(0);
lockQuizHeight();

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(lockQuizHeight);
}

window.addEventListener('resize', lockQuizHeight);
